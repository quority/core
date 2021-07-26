import {
	Logger, RequestManager
} from '../utils'
import {
	Bot
} from './Bot'
import {
	InvalidInterwiki
} from '../errors'

export class Wiki {
	private readonly request: RequestManager

	readonly api: string
	readonly interwiki: string

	constructor( {
		interwiki, request
	}: { interwiki: string, request: RequestManager } ) {
		Logger.community( `Initializing wiki "${ interwiki }".` )

		this.api = Wiki.interwiki2api( interwiki )
		this.interwiki = interwiki
		this.request = request
	}

	static interwiki2path( _interwiki: string ): string {
		const interwiki = _interwiki.toLowerCase()

		if ( interwiki.match( /[a-z0-9-]+\.[a-z0-9-]+/ ) ) {
			const [ lang, wikiname ] = interwiki.split( '.' )
			return `https://${ wikiname }.fandom.com/${ lang }`
		} else if ( interwiki.match( /^[a-z0-9-]$/ ) ) {
			return `https://${ interwiki }.fandom.com`
		}
		throw new InvalidInterwiki( interwiki )
	}

	static interwiki2api( interwiki: string ): string {
		const path = Wiki.interwiki2path( interwiki )
		return `${ path }/api.php`
	}

	static interwiki2url( interwiki: string ): string {
		const path = Wiki.interwiki2path( interwiki )
		return `${ path }/wiki/`
	}

	get<T>( params: Record<string, string | number> ): Promise<T> {
		params.format = 'json'
		params.formatversion = '2'

		const qs: Record<string, string> = {
		}

		for ( const prop in params ) {
			qs[ prop ] = `${ params[prop] }`
		}

		return this.request.get<T>( {
			qs,
			url: this.api
		} )
	}

	post<T>( params: Record<string, string | number> ): Promise<T> {
		params.format = 'json'
		params.formatversion = '2'

		const qs: Record<string, string> = {
		}

		for ( const prop in params ) {
			qs[ prop ] = `${ params[prop] }`
		}

		return this.request.post<T>( {
			form: qs,
			url: this.api
		} )
	}

	async getToken( type: 'createaccount' ): Promise<IApiQueryTokensResponse<'createaccounttoken'>>
	async getToken( type: 'csrf' ): Promise<IApiQueryTokensResponse<'csrftoken'>>
	async getToken( type: 'deleteglobalaccount' ): Promise<IApiQueryTokensResponse<'deleteglobalaccounttoken'>>
	async getToken( type: 'login' ): Promise<IApiQueryTokensResponse<'logintoken'>>
	async getToken( type: 'patrol' ): Promise<IApiQueryTokensResponse<'patroltoken'>>
	async getToken( type: 'rollback' ): Promise<IApiQueryTokensResponse<'rollbacktoken'>>
	async getToken( type: 'setglobalaccountstatus' ): Promise<IApiQueryTokensResponse<'setglobalaccountstatustoken'>>
	async getToken( type: 'userrights' ): Promise<IApiQueryTokensResponse<'userrightstoken'>>
	async getToken( type: 'watch' ): Promise<IApiQueryTokensResponse<'watchtoken'>>
	async getToken( type: TokenType ): Promise<IApiQueryTokensResponse<ITokenType>> {
		const req = await this.get<IApiQueryTokensResponse<ITokenType>>( {
			action: 'query',
			meta: 'tokens',
			type
		} )

		return req
	}

	async login( {
		password, username
	}: { password: string, username: string } ): Promise<Bot> {
		const bot = new Bot( {
			password,
			username,
			wiki: this
		} )

		await bot.login()

		return bot
	}
}
