import {
	Logger, RequestManager
} from '../utils'
import {
	Bot
} from './Bot'
import {
	InvalidInterwikiError
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
		} else if ( interwiki.match( /^[a-z0-9-]+$/ ) ) {
			return `https://${ interwiki }.fandom.com`
		}
		throw new InvalidInterwikiError( interwiki )
	}

	static interwiki2api( interwiki: string ): string {
		const path = Wiki.interwiki2path( interwiki )
		return `${ path }/api.php`
	}

	static interwiki2url( interwiki: string ): string {
		const path = Wiki.interwiki2path( interwiki )
		return `${ path }/wiki/`
	}

	async get<T>( params: Record<string, string | string[] | number | number[] | boolean> ): Promise<T> {
		params.format = 'json'
		params.formatversion = '2'

		const qs: Record<string, string> = {
		}

		for ( const prop in params ) {
			if ( typeof params[prop] === 'boolean' ) {
				qs[ prop ] = params[prop] ? '1' : '0'
			} else if ( Array.isArray( params[prop] ) ) {
				qs[ prop ] = ( params[prop] as unknown[] ).join( '|' )
			} else {
				qs[ prop ] = `${ params[prop] }`
			}
		}

		const res = await this.request.get<T & { error: undefined } | { error: ApiError }>( {
			qs,
			url: this.api
		} )

		if ( res.error !== undefined ) {
			throw res.error
		}

		return res
	}

	async post<T>( params: Record<string, string | string[] | number | number[] | boolean> ): Promise<T> {
		params.format = 'json'
		params.formatversion = '2'

		const qs: Record<string, string> = {
		}

		for ( const prop in params ) {
			if ( typeof params[prop] === 'boolean' ) {
				qs[ prop ] = params[prop] ? '1' : '0'
			} else if ( Array.isArray( params[prop] ) ) {
				qs[ prop ] = ( params[prop] as unknown[] ).join( '|' )
			} else {
				qs[ prop ] = `${ params[prop] }`
			}
		}

		const res = await this.request.post<T & { error: undefined } | { error: ApiError }>( {
			form: qs,
			url: this.api
		} )

		if ( res.error !== undefined ) {
			throw res.error
		}

		return res
	}

	async exists(): Promise<boolean> {
		const req = await this.request.raw( this.api )
		return req.statusCode === 200
	}

	async getPages( _titles: string ): Promise<IApiRevisionsItem>
	async getPages( _titles: string[] ): Promise<IApiRevisionsItem[]>
	async getPages( _titles: string | string[] ): Promise<IApiRevisionsItem | IApiRevisionsItem[]> {
		const titles = Array.isArray( _titles ) ? _titles : [ _titles ]

		const pages: IApiRevisionsItem[] = []

		while ( titles.length !== 0 ) {
			const res = await this.get<IApiRevisionsResponse>( {
				action: 'query',
				prop: 'revisions',
				rvprop: 'content',
				rvslots: 'main',
				titles: titles.splice( 0, 25 ).join( '|' )
			} )

			for ( const page of res.query.pages ) {
				if ( page.missing === true ) {
					continue
				}

				pages.push( page )
			}
		}

		return Array.isArray( _titles ) ? pages : pages[ 0 ]
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

	async query( params: { list: 'allcategories' } & IApiQueryAllcategoriesRequest ): Promise<IApiQueryAllcategoriesItem[]>
	async query( params: { list: 'allimages' } & IApiQueryAllimagesRequest ): Promise<IApiQueryAllimagesItem[]>
	async query( params: { list: 'allpages' } & IApiQueryAllpagesRequest ): Promise<IApiQueryAllpagesItem[]>
	async query( params: { list: 'categorymembers' } & IApiQueryCategorymembersRequest ): Promise<IApiQueryCategorymembersItem[]>
	async query( params: { list: 'usercontribs' } & IApiQueryUsercontribsRequest ): Promise<IApiQueryUsercontribsItem[]>
	async query( params: { list: string } & IApiQueryRequest ): Promise<IApiQueryItem[]> {
		const result: IApiQueryItem[] = []

		// eslint-disable-next-line no-constant-condition
		while ( true ) {
			const req = await this.get<IApiQueryResponse<IApiQueryItem>>( {
				action: 'query',
				...params
			} )

			for ( const item of req.query[ params.list ] ) {
				result.push( item )
			}

			if ( !req.continue ) break

			const continuekey = Object.keys( req.continue ).find( i => i !== 'continue' )
			if ( !continuekey ) break

			params[ continuekey ] = req.continue[ continuekey ]
		}

		return result
	}

	async *iterPages( titles: string[] ): AsyncGenerator<IApiRevisionsItem, void, unknown> {
		while ( titles.length !== 0 ) {
			const res = await this.get<IApiRevisionsResponse>( {
				action: 'query',
				prop: 'revisions',
				rvprop: 'content',
				rvslots: 'main',
				titles: titles.splice( 0, 25 ).join( '|' )
			} )

			for ( const page of res.query.pages ) {
				if ( page.missing === true ) {
					continue
				}

				yield page
			}
		}
	}

	iterQuery( params: { list: 'allcategories' } & IApiQueryAllcategoriesRequest ): AsyncGenerator<IApiQueryAllcategoriesItem, void, unknown>
	iterQuery( params: { list: 'allimages' } & IApiQueryAllimagesRequest ): AsyncGenerator<IApiQueryAllimagesItem, void, unknown>
	iterQuery( params: { list: 'allpages' } & IApiQueryAllpagesRequest ): AsyncGenerator<IApiQueryAllpagesItem, void, unknown>
	iterQuery( params: { list: 'categorymembers' } & IApiQueryCategorymembersRequest ): AsyncGenerator<IApiQueryCategorymembersItem, void, unknown>
	iterQuery( params: { list: 'usercontribs' } & IApiQueryUsercontribsRequest ): AsyncGenerator<IApiQueryUsercontribsItem, void, unknown>
	async *iterQuery( params: { list: string } & IApiQueryRequest ): AsyncGenerator<IApiQueryItem, void, unknown> {
		// eslint-disable-next-line no-constant-condition
		while ( true ) {
			const req = await this.get<IApiQueryResponse<IApiQueryItem>>( {
				action: 'query',
				...params
			} )

			for ( const item of req.query[ params.list ] ) {
				yield item
			}

			if ( !req.continue ) break

			const continuekey = Object.keys( req.continue ).find( i => i !== 'continue' )
			if ( !continuekey ) break

			params[ continuekey ] = req.continue[ continuekey ]
		}
	}
}
