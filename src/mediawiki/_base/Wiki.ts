import type { AddActionQueryToken, APIError, ListQuery, NoActionToken, OpenSearchRequest, OpenSearchResponse, ParseRequest, ParseResponse, PropQuery, PurgeRequest, PurgeResponse, Request, RevisionsRequest, RevisionsResponse, SiteInfoRequest, SiteInfoResponse, TokensRequest, TokensResponse, TokenType } from '../../types'
import fs from 'fs'
import { MediaWikiError } from '../../errors'
import { RequestManager } from '../../utils'

export type Loaded<T extends Wiki = Wiki> = Required<T>

export class Wiki {
	public readonly api: string
	public readonly request: RequestManager

	public mainpage?: string
	public base?: string
	public sitename?: string
	public lang?: string
	public readonly?: boolean
	public writeapi?: boolean
	public articlepath?: string
	public scriptpath?: string
	public script?: string
	public server?: string
	public servername?: string
	public wikiid?: string

	public constructor( { api, request }: { api: string, request?: RequestManager } ) {
		this.api = api.trim()
		this.request = request ?? new RequestManager()
	}

	private querystring<T extends Request>( params: T ): Record<keyof T, string | fs.ReadStream> {
		const qs = {} as Record<keyof T, string | fs.ReadStream>

		let prop: keyof T
		for ( prop in params ) {
			const value = params[ prop ]
			if ( typeof value === 'boolean' ) {
				qs[ prop ] = value ? '1' : '0'
			} else if ( Array.isArray( value ) ) {
				const values = value as unknown[]
				qs[ prop ] =  values.join( '|' )
			} else if ( value instanceof fs.ReadStream ) {
				qs[ prop ] = value
			} else {
				qs[ prop ] = `${ value }`
			}
		}

		return qs
	}

	protected async raw<T, U extends Request>( userparams: U, method: 'GET' | 'POST' ): Promise<T> {
		const params = {
			...userparams,
			format: 'json',
			formatversion: 2
		} as const
		const qs = this.querystring( params )

		const response: T | APIError = method === 'GET'
			? await this.request.get( {
				qs: qs as Record<string, string>,
				url: this.api
			} )
			: await this.request.post( {
				form: qs,
				url: this.api
			} )

		if ( 'error' in response ) {
			throw new MediaWikiError( response.error )
		}

		return response
	}

	public get<T, U extends Request = Request>( userparams: U | U & AddActionQueryToken ): Promise<T> {
		return this.raw( userparams, 'GET' )
	}

	public post<T, U extends Request = Request>( userparams: U | U & AddActionQueryToken ): Promise<T> {
		return this.raw( userparams, 'POST' )
	}

	public async exists(): Promise<boolean> {
		const { statusCode } = await this.request.raw( this.api )
		return statusCode === 200
	}

	public async getInterwikis(): Promise<Record<string, string>> {
		const req = await this.get<SiteInfoResponse, SiteInfoRequest>( {
			action: 'query',
			meta: 'siteinfo',
			siprop: [ 'interwikimap' ]
		} )

		const interwikis = req.query.interwikimap.filter( i => 'language' in i )

		const result: Record<string, string> = {
		}
		for ( const iw of interwikis ) {
			try {
				result[ iw.prefix ] = iw.url
			} catch ( e ) {
				continue
			}
		}

		return result
	}

	public getSiteInfo<T extends keyof SiteInfoResponse[ 'query' ]>( ...properties: T[] ): Promise<SiteInfoResponse> {
		return this.get<SiteInfoResponse, SiteInfoRequest>( {
			action: 'query',
			meta: 'siteinfo',
			siprop: properties
		} )
	}

	public async getPages( _titles: string ): Promise<string>
	public async getPages( _titles: string[] ): Promise<Record<string, string>>
	public async getPages( _titles: string | string[] ): Promise<string | Record<string, string>> {
		const titles = Array.isArray( _titles ) ? _titles : [ _titles ]

		const pages: Record<string, string> = {
		}

		while ( titles.length !== 0 ) {
			const res = await this.get<RevisionsResponse, RevisionsRequest>( {
				action: 'query',
				prop: 'revisions',
				rvprop: [ 'content' ],
				rvslots: 'main',
				titles: titles.splice( 0, 50 ).join( '|' )
			} )

			for ( const page of res.query.pages ) {
				if ( !page.missing ) {
					const { content } = page.revisions[ 0 ].slots.main
					if ( content ) pages[ page.title ] = content
				}
			}
		}

		return Array.isArray( _titles ) ? pages : Object.values( pages )[ 0 ] ?? {}
	}

	public async getToken<Token extends TokenType>( type: Token ): Promise<TokensResponse<Token>> {
		const req = await this.get<TokensResponse<Token>, TokensRequest>( {
			action: 'query',
			meta: 'tokens',
			type
		} )

		return req
	}

	public getURL( title: string ): string {
		title = title.replace( / /g, '_' )
		const base = new URL( this.api ).origin
		const articlepath = new URL( this.articlepath ?? '/wiki/$1', base ).href
		return articlepath.replace( '$1', encodeURI( title ) )
	}

	public async load(): Promise<Loaded<this>> {
		const siteinfo = await this.getSiteInfo( 'general' )

		this.mainpage = siteinfo.query.general.mainpage
		this.base = siteinfo.query.general.base
		this.sitename = siteinfo.query.general.sitename
		this.lang = siteinfo.query.general.lang
		this.readonly = siteinfo.query.general.readonly
		this.writeapi = siteinfo.query.general.writeapi
		this.articlepath = siteinfo.query.general.articlepath
		this.scriptpath = siteinfo.query.general.scriptpath
		this.script = siteinfo.query.general.script
		this.server = siteinfo.query.general.server
		this.servername = siteinfo.query.general.servername
		this.wikiid = siteinfo.query.general.wikiid

		return this as Loaded<this>
	}

	public async pagesExist( _titles: string ): Promise<boolean>
	public async pagesExist<T extends string>( _titles: T[] ): Promise<Record<T, boolean>>
	public async pagesExist<T extends string>( _titles: T ): Promise<boolean | Record<string, boolean>> {
		const titles = Array.isArray( _titles ) ? _titles : [ _titles ]

		const pages: Record<string, boolean> = {
		}

		while ( titles.length !== 0 ) {
			const res = await this.get<RevisionsResponse, RevisionsRequest>( {
				action: 'query',
				prop: 'revisions',
				rvprop: [ 'content' ],
				rvslots: 'main',
				titles: titles.splice( 0, 50 ).join( '|' )
			} )

			for ( const page of res.query.pages ) {
				if ( typeof _titles === 'string' ) {
					return !page.missing
				}
				pages[ page.title ] = !page.missing
			}
		}

		return pages
	}

	public parse( params: NoActionToken<ParseRequest> ): Promise<ParseResponse> {
		return this.get<ParseResponse, ParseRequest>( {
			...params,
			action: 'parse'
		} )
	}

	public async purge<T extends string>( titles: T[] ): Promise<Record<T, boolean>> {
		const result: Record<string, boolean> = {
		}

		while ( titles.length !== 0 ) {
			const req = await this.post<PurgeResponse, PurgeRequest>( {
				action: 'purge',
				titles: titles.splice( 0, 50 ).join( '|' )
			} )

			for ( const item of req.purge ) {
				if ( 'missing' in item ) {
					result[ item.title ] = false
				} else {
					result[ item.title ] = true
				}
			}
		}

		return result
	}

	public search( params: NoActionToken<OpenSearchRequest> ): Promise<OpenSearchResponse> {
		return this.get( {
			...params,
			action: 'opensearch'
		} )
	}

	public async queryList<ListName extends keyof ListQuery = keyof ListQuery>( params: { list: ListName } & ListQuery[ ListName ][ 0 ], limit?: number ): Promise<Array<ListQuery[ ListName ][ 2 ]>> {
		const generator = this.iterQueryList<ListName>( params, limit )
		const result: Array<ListQuery[ ListName ][ 2 ]> = []
		for await ( const item of generator ) {
			result.push( item )
		}
		return result
	}

	public async *iterQueryList<ListName extends keyof ListQuery = keyof ListQuery>( params: { list: ListName } & ListQuery[ ListName ][ 0 ], limit?: number ): AsyncGenerator<ListQuery[ ListName ][ 2 ]> {
		let counter = 0
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while ( true ) {
			const req = await this.get<ListQuery[ ListName ][ 1 ] & { query: { [ key in ListName ]: Array<ListQuery[ ListName ][ 2 ]> } }>( {
				action: 'query',
				...params
			} )

			const results = req.query[ params.list ] as Array<ListQuery[ ListName ][ 2 ]> | undefined
			if ( results ) {
				for ( const item of results ) {
					yield item
					counter++
					if ( limit && counter === limit ) return
				}
			}

			if ( !req.continue ) break
			const continuekey = Object.keys( req.continue ).find( i => i !== 'continue' )
			if ( !continuekey ) break
			// @ts-expect-error - faulty typing i don't know how to fix
			params[ continuekey ] = req.continue[ continuekey ] // eslint-disable-line @typescript-eslint/no-unsafe-assignment
		}
	}

	public async queryProp<PropName extends keyof PropQuery = keyof PropQuery>( params: { prop: PropName } & PropQuery[ PropName ][ 0 ], limit?: number ): Promise<Array<PropQuery[ PropName ][ 2 ]>> {
		const generator = this.iterQueryProp<PropName>( params, limit )
		const result: Array<PropQuery[ PropName ][ 2 ]> = []
		for await ( const item of generator ) {
			result.push( item )
		}
		return result.flat()
	}

	public async rawQueryProp<PropName extends keyof PropQuery = keyof PropQuery>( params: { prop: PropName } & PropQuery[ PropName ][ 0 ] ): Promise<PropQuery[ PropName ][ 1 ][ 'query' ]> {
		const res = await this.get<PropQuery[ PropName ][ 1 ]>( {
			action: 'query',
			...params
		} )
		return res.query
	}

	public async *iterQueryProp<PropName extends keyof PropQuery = keyof PropQuery>( params: { prop: PropName } & PropQuery[ PropName ][ 0 ], limit?: number ): AsyncGenerator<PropQuery[ PropName ][ 2 ]> {
		let counter = 0
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while ( true ) {
			const req = await this.get<PropQuery[ PropName ][ 1 ] & { query: { [ key in PropName ]: Array<PropQuery[ PropName ][ 2 ]> } }>( {
				action: 'query',
				...params
			} )

			const results = req.query.pages
			for ( const item of results ) {
				yield item as PropQuery[ PropName ][ 2 ]
				counter++
				if ( limit && counter === limit ) return
			}

			if ( !req.continue ) break
			const continuekey = Object.keys( req.continue ).find( i => i !== 'continue' )
			if ( !continuekey ) break
			// @ts-expect-error - faulty typing i don't know how to fix
			params[ continuekey ] = req.continue[ continuekey ] // eslint-disable-line @typescript-eslint/no-unsafe-assignment
		}
	}

	public async *iterPages( titles: string[] ): AsyncGenerator<RevisionsResponse[ 'query' ][ 'pages' ][ 0 ], void, unknown> {
		while ( titles.length !== 0 ) {
			const res = await this.get<RevisionsResponse, RevisionsRequest>( {
				action: 'query',
				prop: 'revisions',
				rvprop: [ 'content' ],
				rvslots: 'main',
				titles: titles.splice( 0, 50 ).join( '|' )
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
