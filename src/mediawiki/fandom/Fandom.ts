import { FandomBot } from './FandomBot'
import { FandomWiki } from './FandomWiki'
import type { ICookieJarOptions } from '../../utils'
import { InvalidInterwikiError } from '../../errors'
import { RequestManager } from '../../utils'

export class Fandom {
	public static request?: RequestManager

	public readonly request: RequestManager

	public constructor( { cookies, prettyCookies = false, requestOptions = {} }: { cookies?: string, prettyCookies?: boolean, requestOptions?: ConstructorParameters<typeof RequestManager>[ 0 ] } = {} ) {
		const jarOptions: ICookieJarOptions = {
			prettify: prettyCookies
		}
		if ( cookies ) {
			jarOptions.store = {
				path: cookies,
				regex: [ /^wiki(a|cities)_/ ]
			}
		}
		this.request = new RequestManager( {
			...requestOptions,
			jarOptions
		} )
	}

	public static interwiki2path( _interwiki: string ): string {
		const interwiki = _interwiki.toLowerCase()

		if ( interwiki.match( /[a-z0-9-]+\.[a-z0-9-]+/ ) ) {
			const [
				lang, wikiname
			] = interwiki.split( '.' )
			return `https://${ wikiname }.fandom.com/${ lang }`
		} else if ( interwiki.match( /^[a-z0-9-]+$/ ) ) {
			return `https://${ interwiki }.fandom.com`
		}
		throw new InvalidInterwikiError( interwiki )
	}

	public static getWiki( interwiki: string ): FandomWiki {
		if ( !this.request ) this.request = new RequestManager()
		return new FandomWiki( {
			interwiki,
			request: this.request
		} )
	}

	public static interwiki2api( interwiki: string ): string {
		const path = Fandom.interwiki2path( interwiki )
		return `${ path }/api.php`
	}

	public static interwiki2url( interwiki: string ): string {
		const path = Fandom.interwiki2path( interwiki )
		return `${ path }/wiki/`
	}

	public static url2interwiki( url: string ): string {
		const nolangRegex = /https?:\/\/([a-z0-9-]+)\.fandom\.com\/(wiki|api|index)/
		const nolang = url.match( nolangRegex )?.[ 1 ]
		if ( nolang ) {
			return nolang
		}

		const langRegex = /https?:\/\/([a-z0-9-]+)\.fandom\.com\/([a-z-]+)\/(wiki|api|index)/
		const lang = url.match( langRegex )

		if ( lang ) {
			return `${ lang[ 2 ] }.${ lang[ 1 ] }`
		}

		throw new InvalidInterwikiError( url )
	}

	public async getUserAvatar( username: string ): Promise<string | null> {
		const userId = await this.getUserId( username )
		if ( !userId ) return null

		const { body } = await this.request.raw( `https://services.fandom.com/user-attribute/user/${ userId }/attr/avatar` )
		const res = await body.json() as unknown as { value?: string }

		return res.value ?? null
	}

	public async getUserDiscordTag( username: string ): Promise<string | null> {
		const userId = await this.getUserId( username )
		if ( !userId ) return null

		const { body } = await this.request.raw( `https://services.fandom.com/user-attribute/user/${ userId }/attr/discordHandle` )
		const res = await body.json() as unknown as { value?: string }

		return res.value ?? null
	}

	public async getUserId( username: string ): Promise<number | null> {
		const wiki = this.getWiki( 'community' )
		const query = await wiki.queryList( {
			list: 'users',
			ususers: username
		} )
		return query[ 0 ]?.userid ?? null
	}

	public async getUsersIds( usernames: string[] ): Promise<Record<string, number>> {
		const wiki = this.getWiki( 'community' )
		const query = await wiki.queryList( {
			list: 'users',
			ususers: usernames
		} )
		return query.reduce( ( result, user ) => {
			result[ user.name ] = user.userid
			return result
		}, {} as Record<string, number> )
	}

	public getWiki( interwiki: string ): FandomWiki {
		return new FandomWiki( {
			interwiki,
			request: this.request
		} )
	}

	public async login( {
		password, username, wiki
	}: { password: string, username: string, wiki?: FandomWiki } ): Promise<FandomBot> {
		const bot = new FandomBot( {
			password,
			username,
			wiki: wiki ?? this.getWiki( 'community' )
		} )

		await bot.login()

		return bot
	}
}
