import { BaseStrategy } from './BaseStrategy'
import { s } from '@sapphire/shapeshift'
import { InvalidInterwikiError } from '../errors'
import type { Wiki } from '../mediawiki'
import { WikiaEndpoint } from './custom'
import type { RequestManager } from '../utils'
import type { TokensResponse } from '../types'

export class Fandom extends BaseStrategy {
	public static override cookieRegexes = [ /session/i, /csrf_token/ ]

	public static readonly InterwikiRegex = /^([a-z-]{2,5}\.)?[a-z0-9-]+$/
	public readonly InterwikiRegex = Fandom.InterwikiRegex

	public static readonly InterwikiValidator = s.string.regex( Fandom.InterwikiRegex )
	public readonly InterwikiValidator = Fandom.InterwikiValidator

	public static readonly services = new URL( 'https://services.fandom.com/' )
	public readonly services = Fandom.services

	public override custom: {
		wikia: WikiaEndpoint
	}

	public readonly request: RequestManager

	public constructor( wiki: Wiki<Fandom> ) {
		super( wiki )
		this.custom = {
			wikia: new WikiaEndpoint( wiki )
		}
		this.request = wiki.request
	}

	public static override getApi( api: string ): URL {
		if ( this.InterwikiValidator.run( api ).isOk() ) {
			const url = Fandom.interwiki2base( api )
			url.pathname = `${ url.pathname }api.php`
			return url
		} else {
			return new URL( api )
		}
	}

	public async getCSRFToken( force = false ): Promise<string> {
		if ( this.csrf && !force ) return this.csrf

		const searchParams = new URLSearchParams( {
			action: 'query',
			format: 'json',
			formatversion: '2',
			meta: 'tokens',
			type: 'csrf'
		} ).toString()
		const { body } = await this.request.raw(
			new URL( `?${ searchParams }`, this.wiki.api ),
			{
				method: 'GET'
			},
			{
				cookieUrl: this.services
			}
		)
		const res = await body.json() as TokensResponse
		this.csrf = res.query.tokens.csrftoken
		return this.csrf
	}

	public static interwiki2base( interwiki: string ): URL {
		if ( interwiki.match( /^[a-z0-9-]+\.[a-z0-9-]+/i ) ) {
			const [ lang, name ] = interwiki.split( '.' )
			return new URL( `https://${ name }.fandom.com/${ lang }/` )
		} else if ( interwiki.match( /^[a-z0-9-]+$/i ) ) {
			return new URL( `https://${ interwiki }.fandom.com/` )
		}
		throw new InvalidInterwikiError( interwiki )
	}

	public async getUserId( username: string ): Promise<number | null> {
		const query = await this.wiki.queryList( {
			list: 'users',
			ususers: username
		} )
		return query[ 0 ]?.userid ?? null
	}

	public async getUserAttr( username: string, attr: 'avatar' | 'bio' | 'discordHandle' | 'name' | 'nickname' ): Promise<string | null> {
		const userId = await this.getUserId( username )
		if ( !userId ) return null

		const { body } = await this.wiki.request.raw( new URL( `/user-attribute/user/${ userId }/attr/${ attr }`, this.services ) )
		const res = await body.json() as {
			name: string
			value: string
		}

		return res.value
	}

	public async getWikiId(): Promise<number> {
		const siteinfo = await this.wiki.get( {
			action: 'query',
			meta: 'siteinfo',
			siprop: 'variables'
		} ) as { query: { variables: Array<{
			id: string
			'*': number
		}> } }
		const cityId = siteinfo.query.variables.find( i => i.id === 'wgCityId' )?.[ '*' ]
		return cityId ?? 0
	}

	public async login( username: string, password: string ): Promise<void> {
		const flow = await this.request.get( 'https://services.fandom.com/kratos-public/self-service/login/api' ) as {
			id: string
			ui: {
				action: string
			}
		}
		await this.request.raw( flow.ui.action, {
			body: new URLSearchParams( {
				captcha_token: '',
				csrf_token: '',
				identifier: username,
				method: 'password',
				password
			} ).toString(),
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'POST'
		} )

		await this.getCSRFToken( true )
	}
}
