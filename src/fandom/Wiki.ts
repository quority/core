import {
	ApiError,
	InvalidInterwikiError
} from '../errors'
import {
	Logger, RequestManager
} from '../utils'
import fs from 'fs'

export class Wiki {
	private readonly request: RequestManager

	readonly api: string
	readonly interwiki: string

	articlepath?: string
	base?: string
	id?: number
	lang?: string
	mainpage?: string
	namespaces?: Record<`${ number }`, INamespace>
	readonly?: boolean
	script?: string
	scriptpath?: string
	server?: string
	sitename?: string
	wikiid?: string
	writeapi?: boolean

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

	static url2interwiki( url: string ): string {
		const nolangRegex = /https?:\/\/([a-z0-9-]+)\.fandom\.com\/(wiki|api|index)/
		const nolang = url.match( nolangRegex )
		if ( nolang ) {
			return nolang[1]
		}

		const langRegex = /https?:\/\/([a-z0-9-]+)\.fandom\.com\/([a-z-]+)\/(wiki|api|index)/
		const lang = url.match( langRegex )

		if ( lang ) {
			return `${ lang[2] }.${ lang[1] }`
		}

		throw new InvalidInterwikiError( url )
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

		const res = await this.request.get<T & { error: undefined } | { error: ApiErrorCode }>( {
			qs,
			url: this.api
		} )

		if ( res.error !== undefined ) {
			throw new ApiError( res.error )
		}

		return res
	}

	async post<T>( params: Record<string, string | string[] | number | number[] | boolean | fs.ReadStream> ): Promise<T> {
		params.format = 'json'
		params.formatversion = '2'

		const qs: Record<string, string | fs.ReadStream> = {
		}

		for ( const prop in params ) {
			if ( params[prop] instanceof fs.ReadStream ) {
				qs[ prop ] = params[prop] as fs.ReadStream
			} else if ( typeof params[prop] === 'boolean' ) {
				qs[ prop ] = params[prop] ? '1' : '0'
			} else if ( Array.isArray( params[prop] ) ) {
				qs[ prop ] = ( params[prop] as unknown[] ).join( '|' )
			} else {
				qs[ prop ] = `${ params[prop] }`
			}
		}

		const res = await this.request.post<T & { error: undefined } | { error: ApiErrorCode }>( {
			form: qs,
			url: this.api
		} )

		if ( res.error !== undefined ) {
			throw new ApiError( res.error )
		}

		return res
	}

	async exists(): Promise<boolean> {
		const req = await this.request.raw( this.api )
		return req.status === 200
	}

	async getInterwikis(): Promise<Record<string, string>> {
		const req = await this.get<IInterwikimap>( {
			action: 'query',
			meta: 'siteinfo',
			siprop: 'interwikimap'
		} )

		const interwikis = req.query.interwikimap.filter( i => i.language )

		const result: Record<string, string> = {
		}
		for ( const iw of interwikis ) {
			try {
				result[ iw.prefix ] = Wiki.url2interwiki( iw.url )
			} catch ( e ) {
				Logger.error( `An error occurred when processing "${ iw.prefix }" interwiki: ${ iw.url }. It will be skipped.` )
			}
		}

		return result
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

	getSiteinfo(): Promise<ISiteinfoResponse> {
		return this.get<ISiteinfoResponse>( {
			action: 'query',
			meta: 'siteinfo',
			siprop: 'general|namespaces|variables'
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

	async load(): Promise<Required<Wiki>> {
		const siteinfo = ( await this.getSiteinfo() ).query

		this.articlepath = siteinfo.general.articlepath
		this.base = siteinfo.general.base
		this.id = siteinfo.variables.find( i => i.id === 'wgCityId' )?.['*'] as number
		this.lang = siteinfo.variables.find( i => i.id === 'wgLanguageCode' )?.['*'] as string
		this.mainpage = siteinfo.general.mainpage
		this.namespaces = siteinfo.namespaces
		this.readonly = siteinfo.general.readonly
		this.script = siteinfo.general.script
		this.scriptpath = siteinfo.general.scriptpath
		this.server = siteinfo.general.server
		this.sitename = siteinfo.general.sitename
		this.wikiid = siteinfo.general.wikiid
		this.writeapi = siteinfo.general.writeapi

		return this as Required<Wiki>
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

	async *whatLinksHere( titles: string[] ): AsyncGenerator<{
		linkshere: {
			title: string,
			redirect: boolean
		}[],
		missing?: boolean,
		title: string
	}, void, unknown> {
		while ( titles.length !== 0 ) {
			const res = await this.get<{
				query: {
					pages: {
						linkshere: {
							title: string,
							redirect: boolean
						}[],
						missing?: boolean,
						title: string
					}[]
				}
			}>( {
				action: 'query',
				prop: 'linkshere',
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
}
