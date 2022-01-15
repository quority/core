import type { AllCategoriesRequest, AllCategoriesResponse, AllImagesRequest, AllImagesResponse, AllPagesRequest, AllPagesResponse, CategoryMembersRequest, CategoryMembersResponse, GETRequestJSON, ListQueryResponse, LogEventsRequest, LogEventsResponse, NoActionToken, NoJSONRequest, POSTRequestJSON, PurgeResponse, QueryRequest, RecentChangesRequest, RecentChangesResponse, Request, RevisionsResponse, SiteInfoRequest, SiteInfoResponse, TokensRequest, TokensResponse, TokenType, TranscludedInRequest, TranscludedInResponse, UserContribsRequest, UserContribsResponse, UsersRequest, UsersResponse } from '../../types'
import fs from 'fs'
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

	private querystring<T extends NoJSONRequest<GETRequestJSON>>( params: T ): Record<keyof T, string>
	private querystring<T extends NoJSONRequest<POSTRequestJSON>>( params: T ): Record<keyof T, string | fs.ReadStream>
	private querystring<T extends NoJSONRequest<GETRequestJSON | POSTRequestJSON>>( params: T ): Record<keyof T, string | fs.ReadStream> {
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

	protected raw<T, U extends Request>( userparams: NoJSONRequest<U>, method: 'GET' | 'POST' ): Promise<T> {
		const params = {
			...userparams,
			format: 'json',
			formatversion: 2
		}
		const qs = this.querystring( params )

		if ( method === 'GET' ) {
			return this.request.get( {
				qs: qs as Record<string, string>,
				url: this.api
			} )
		} else {
			return this.request.post( {
				form: qs,
				url: this.api
			} )
		}
	}

	public get<T, U extends Request = GETRequestJSON>( userparams: NoJSONRequest<U> ): Promise<T> {
		return this.raw( userparams, 'GET' )
	}

	public post<T, U extends POSTRequestJSON = POSTRequestJSON>( userparams: NoJSONRequest<U> ): Promise<T> {
		return this.raw( userparams, 'POST' )
	}

	public async exists(): Promise<boolean> {
		const req = await this.request.raw( this.api )
		return req.status === 200
	}

	public async getInterwikis(): Promise<Record<string, string>> {
		const req = await this.get<SiteInfoResponse>( {
			action: 'query',
			meta: 'siteinfo',
			siprop: 'interwikimap'
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
			const res = await this.get<RevisionsResponse>( {
				action: 'query',
				prop: 'revisions',
				rvprop: 'content',
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

	public async pagesExist( _titles: string ): Promise<Record<string, boolean>>
	public async pagesExist( _titles: string[] ): Promise<Record<string, boolean>>
	public async pagesExist( _titles: string | string[] ): Promise<Record<string, boolean>> {
		const titles = Array.isArray( _titles ) ? _titles : [ _titles ]

		const pages: Record<string, boolean> = {
		}

		while ( titles.length !== 0 ) {
			const res = await this.get<RevisionsResponse>( {
				action: 'query',
				prop: 'revisions',
				rvprop: 'content',
				rvslots: 'main',
				titles: titles.splice( 0, 50 ).join( '|' )
			} )

			for ( const page of res.query.pages ) {
				pages[ page.title ] = page.missing ?? false
			}
		}

		return pages
	}

	public async purge( titles: string[] ): Promise<Record<string, boolean>> {
		const result: Record<string, boolean> = {
		}

		while ( titles.length !== 0 ) {
			const req = await this.post<PurgeResponse>( {
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

	public async queryList( params: { list: 'allcategories' } & NoActionToken<AllCategoriesRequest>, limit?: number ): Promise<AllCategoriesResponse[ 'query' ][ 'allcategories' ]>
	public async queryList( params: { list: 'allimages' } & NoActionToken<AllImagesRequest>, limit?: number ): Promise<AllImagesResponse[ 'query' ][ 'allimages' ]>
	public async queryList( params: { list: 'allpages' } & NoActionToken<AllPagesRequest>, limit?: number ): Promise<AllPagesResponse[ 'query' ][ 'allpages' ]>
	public async queryList( params: { list: 'categorymembers' } & NoActionToken<CategoryMembersRequest>, limit?: number ): Promise<CategoryMembersResponse[ 'query' ][ 'categorymembers' ]>
	public async queryList( params: { list: 'logevents' } & NoActionToken<LogEventsRequest>, limit?: number ): Promise<LogEventsResponse[ 'query' ][ 'logevents' ]>
	public async queryList( params: { list: 'recentchanges' } & NoActionToken<RecentChangesRequest>, limit?: number ): Promise<RecentChangesResponse[ 'query' ][ 'recentchanges' ]>
	public async queryList( params: { list: 'usercontribs' } & NoActionToken<UserContribsRequest>, limit?: number ): Promise<UserContribsResponse[ 'query' ][ 'usercontribs' ]>
	public async queryList( params: { list: 'users' } & NoActionToken<UsersRequest>, limit?: number ): Promise<UsersResponse[ 'query' ][ 'users' ]>
	public async queryList( params: { list: string } & NoActionToken<QueryRequest>, limit?: number ): Promise<ListQueryResponse[ 'query' ][ string ]> {
		const generator = this.iterQueryList( params, limit )
		const result: ListQueryResponse[ 'query' ][ string ] = []
		for await ( const item of generator ) {
			result.push( item )
		}
		return result
	}

	public iterQueryList( params: { list: 'allcategories' } & NoActionToken<AllCategoriesRequest>, limit?: number ): AsyncGenerator<AllCategoriesResponse[ 'query' ][ 'allcategories' ][ 0 ], void, unknown>
	public iterQueryList( params: { list: 'allimages' } & NoActionToken<AllImagesRequest>, limit?: number ): AsyncGenerator<AllImagesResponse[ 'query' ][ 'allimages' ][ 0 ], void, unknown>
	public iterQueryList( params: { list: 'allpages' } & NoActionToken<AllPagesRequest>, limit?: number ): AsyncGenerator<AllPagesResponse[ 'query' ][ 'allpages' ][ 0 ], void, unknown>
	public iterQueryList( params: { list: 'categorymembers' } & NoActionToken<CategoryMembersRequest>, limit?: number ): AsyncGenerator<CategoryMembersResponse[ 'query' ][ 'categorymembers' ][ 0 ], void, unknown>
	public iterQueryList( params: { list: 'logevents' } & NoActionToken<LogEventsRequest>, limit?: number ): AsyncGenerator<LogEventsResponse[ 'query' ][ 'logevents' ][ 0 ], void, unknown>
	public iterQueryList( params: { list: 'recentchanges' } & NoActionToken<RecentChangesRequest>, limit?: number ): AsyncGenerator<RecentChangesResponse[ 'query' ][ 'recentchanges' ][ 0 ], void, unknown>
	public iterQueryList( params: { list: 'usercontribs' } & NoActionToken<UserContribsRequest>, limit?: number ): AsyncGenerator<UserContribsResponse[ 'query' ][ 'usercontribs' ][ 0 ], void, unknown>
	public iterQueryList( params: { list: 'users' } & NoActionToken<UsersRequest>, limit?: number ): AsyncGenerator<UsersResponse[ 'query' ][ 'users' ][ 0 ], void, unknown>
	public iterQueryList( params: { list: string } & NoActionToken<QueryRequest>, limit?: number ): AsyncGenerator<ListQueryResponse[ 'query' ][ string ][ 0 ], void, unknown>
	public async *iterQueryList( params: { list: string } & NoActionToken<QueryRequest>, limit?: number ): AsyncGenerator<ListQueryResponse[ 'query' ][ string ][ 0 ], void, unknown> {
		let counter = 0
		// eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
		while ( true ) {
			const req = await this.get<ListQueryResponse>( {
				action: 'query',
				...params
			} )

			const [ results ] = Object.values( req.query )
			if ( results ) {
				for ( const item of results ) {
					yield item
					counter++
					if ( limit && counter === limit ) {
						return
					}
				}
			}

			if ( !req.continue ) break

			const continuekey = Object.keys( req.continue ).find( i => i !== 'continue' )
			if ( !continuekey ) break
			// @ts-expect-error - faulty typing i don't know how to fix
			params[ continuekey ] = req.continue[ continuekey ] // eslint-disable-line @typescript-eslint/no-unsafe-assignment
		}
	}

	public async queryProp( params: { prop: 'transcludedin' } & NoActionToken<TranscludedInRequest>, limit?: number ): Promise<TranscludedInResponse[ 'query' ][ 'pages' ]>
	public async queryProp( params: { prop: string } & NoActionToken<QueryRequest>, limit?: number ): Promise<ListQueryResponse[ 'query' ][ string ]> {
		const generator = this.iterQueryProp( params, limit )
		const result: ListQueryResponse[ 'query' ][ string ] = []
		for await ( const item of generator ) {
			result.push( item )
		}
		return result
	}

	public iterQueryProp( params: { prop: 'transcludedin' } & NoActionToken<TranscludedInRequest>, limit?: number ): AsyncGenerator<TranscludedInResponse[ 'query' ][ 'pages' ][ 0 ], void, unknown>
	public iterQueryProp( params: { prop: string } & NoActionToken<QueryRequest>, limit?: number ): AsyncGenerator<ListQueryResponse[ 'query' ][ string ][ 0 ], void, unknown>
	public async *iterQueryProp( params: { prop: string } & NoActionToken<QueryRequest>, limit?: number ): AsyncGenerator<ListQueryResponse[ 'query' ][ string ][ 0 ], void, unknown> {
		let counter = 0
		// eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
		while ( true ) {
			const req = await this.get<ListQueryResponse>( {
				action: 'query',
				...params
			} )

			const [ results ] = Object.values( req.query )
			if ( results ) {
				for ( const item of results ) {
					yield item
					counter++
					if ( limit && counter === limit ) {
						return
					}
				}
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
			const res = await this.get<RevisionsResponse>( {
				action: 'query',
				prop: 'revisions',
				rvprop: 'content',
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

	public async *whatLinksHere( titles: string[] ): AsyncGenerator<{
		linkshere: Array<{
			title: string,
			redirect: boolean
		}>,
		missing?: boolean,
		title: string
	}, void, unknown> {
		while ( titles.length !== 0 ) {
			const res = await this.get<{
				query: {
					pages: Array<{
						linkshere: Array<{
							title: string,
							redirect: boolean
						}>,
						missing?: boolean,
						title: string
					}>
				}
			}>( {
				action: 'query',
				prop: 'linkshere',
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
