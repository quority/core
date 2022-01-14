import {
	Logger,
	RequestManager
} from '../../utils'
import {
	MediaWikiMetaRequest,
	MediaWikiMetaResponse,
	MediaWikiQueryItem,
	MediaWikiQueryRequest,
	MediaWikiQueryResponses,
	MediaWikiRequest,
	MediaWikiResponse,
	ReducedRequest,
	RequestGETParameters,
	RequestPOSTParameters,
	TokenType
} from '../../types'
import fs from 'fs'

export type Loaded<T extends Wiki = Wiki> = Required<T>

export class Wiki {
	readonly api: string
	readonly request: RequestManager

	mainpage?: string
	base?: string
	sitename?: string
	lang?: string
	readonly?: boolean
	writeapi?: boolean
	articlepath?: string
	scriptpath?: string
	script?: string
	server?: string
	servername?: string
	wikiid?: string

	constructor( {
		api, disableLogger = true, request
	}: { api: string, disableLogger?: boolean, request?: RequestManager } ) {
		this.api = api.trim()
		this.request = request ?? new RequestManager()
		if ( disableLogger ) {
			Logger.disable()
		}
	}

	async get<T, U = RequestGETParameters>( userparams: U ): Promise<T> {
		const params = {
			...userparams,
			format: 'json',
			formatversion: 2
		}
		type ParamsKey = keyof typeof params

		const qs = {
		} as Record<ParamsKey, string>

		let prop: ParamsKey
		for ( prop in params ) {
			const value = params[ prop ]
			if ( !value ) {
				continue
			} else if ( typeof value === 'boolean' ) {
				qs[ prop ] = value ? '1' : '0'
			} else if ( Array.isArray( value ) ) {
				qs[ prop ] = ( value as unknown[] ).join( '|' )
			} else {
				qs[ prop ] = `${ value }`
			}
		}

		const res = await this.request.get<T>( {
			qs,
			url: this.api
		} )

		return res
	}

	async post<T, U = RequestPOSTParameters>( userparams: U ): Promise<T> {
		const params = {
			...userparams,
			format: 'json',
			formatversion: 2
		}
		type ParamsKey = keyof typeof params

		const qs = {
		} as Record<ParamsKey, string | fs.ReadStream>

		let prop: ParamsKey
		for ( prop in params ) {
			const value = params[ prop ]
			if ( !value ) {
				continue
			} else if ( value instanceof fs.ReadStream ) {
				qs[ prop ] = value as fs.ReadStream
			} else if ( typeof value === 'boolean' ) {
				qs[ prop ] = value ? '1' : '0'
			} else if ( Array.isArray( value ) ) {
				qs[ prop ] = ( value as unknown[] ).join( '|' )
			} else {
				qs[ prop ] = `${ value }`
			}
		}

		const res = await this.request.post<T>( {
			form: qs,
			url: this.api
		} )

		return res
	}

	async exists(): Promise<boolean> {
		const req = await this.request.raw( this.api )
		return req.status === 200
	}

	async getInterwikis(): Promise<Record<string, string>> {
		const req = await this.get<MediaWikiMetaResponse.SiteInfo>( {
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
				Logger.error( `An error occurred when processing "${ iw.prefix }" interwiki: ${ iw.url }. It will be skipped.` )
			}
		}

		return result
	}

	getSiteInfo<T extends keyof MediaWikiMetaResponse.SiteInfo[ 'query' ]>( ...properties: T[] ): Promise<MediaWikiMetaResponse.SiteInfo> {
		return this.get<MediaWikiMetaResponse.SiteInfo, MediaWikiMetaRequest.SiteInfo>( {
			action: 'query',
			meta: 'siteinfo',
			siprop: properties
		} )
	}

	async getPages( _titles: string ): Promise<string>
	async getPages( _titles: string[] ): Promise<Record<string, string>>
	async getPages( _titles: string | string[] ): Promise<string | Record<string, string>> {
		const titles = Array.isArray( _titles ) ? _titles : [ _titles ]

		const pages: Record<string, string> = {
		}

		while ( titles.length !== 0 ) {
			const res = await this.get<MediaWikiResponse.Revisions>( {
				action: 'query',
				prop: 'revisions',
				rvprop: 'content',
				rvslots: 'main',
				titles: titles.splice( 0, 50 ).join( '|' )
			} )

			for ( const page of res.query.pages ) {
				if ( page.missing === true ) {
					pages[ page.title ] = ''
				}
				
				const content = page.revisions[ 0 ]?.slots.main.content
				if ( content ) pages[ page.title ] = content
			}
		}

		return Array.isArray( _titles ) ? pages : Object.values( pages )[ 0 ] ?? {}
	}

	async getToken<Token extends TokenType>( type: Token ): Promise<MediaWikiMetaResponse.Tokens<Token>> {
		const req = await this.get<MediaWikiMetaResponse.Tokens<Token>, MediaWikiMetaRequest.Tokens>( {
			action: 'query',
			meta: 'tokens',
			type
		} )

		return req
	}

	async getTransclusions( title: string ): Promise<string[]> {
		const result: string[] = []

		const params: Record<string, string | number> = {
			action: 'query',
			prop: 'transcludedin',
			tilimit: 'max',
			tinamespace: '0',
			tiprop: 'title',
			tishow: '!redirect',
			titles: title
		}

		// eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
		while ( true ) {
			const req = await this.get< {
				continue?: {
					ticontinue: string
				}
				query: {
					pages: Array<{
						transcludedin: Array<{
							ns: number
							title: string
						}>
					}>
				}
			} >( params )

			const results = req.query.pages[ 0 ]?.transcludedin
			if ( results ) {
				for ( const item of results ) {
					if ( item.ns !== 0 ) continue
					result.push( item.title )
				}
			}

			if ( !req.continue ) break

			params.ticontinue = req.continue.ticontinue
		}

		return result
	}

	getURL( title: string ): string {
		const base = new URL( this.api ).origin
		const articlepath = new URL( this.articlepath ?? '/wiki/$1', base ).href
		return articlepath.replace( '$1', encodeURI( title ) )
	}

	async load(): Promise<Loaded<this>> {
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

	async pagesExist( _titles: string ): Promise<Record<string, boolean>>
	async pagesExist( _titles: string[] ): Promise<Record<string, boolean>>
	async pagesExist( _titles: string | string[] ): Promise<Record<string, boolean>> {
		const titles = Array.isArray( _titles ) ? _titles : [ _titles ]

		const pages: Record<string, boolean> = {
		}

		while ( titles.length !== 0 ) {
			const res = await this.get<MediaWikiResponse.Revisions>( {
				action: 'query',
				prop: 'revisions',
				rvprop: 'content',
				rvslots: 'main',
				titles: titles.splice( 0, 50 ).join( '|' )
			} )

			for ( const page of res.query.pages ) {
				pages[ page.title ] = page.missing ? false : true
			}
		}

		return pages
	}

	async purge( titles: string[] ): Promise<Record<string, boolean>> {
		const result: Record<string, boolean> = {
		}

		while ( titles.length !== 0 ) {
			const req = await this.post<MediaWikiResponse.Purge, MediaWikiRequest.Purge>( {
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

	async query( params: { list: 'allcategories' } & ReducedRequest<MediaWikiQueryRequest.AllCategories>, limit?: number ): Promise<MediaWikiQueryItem.AllCategories[]>
	async query( params: { list: 'allimages' } & ReducedRequest<MediaWikiQueryRequest.AllImages>, limit?: number ): Promise<MediaWikiQueryItem.AllImages[]>
	async query( params: { list: 'allpages' } & ReducedRequest<MediaWikiQueryRequest.AllPages>, limit?: number ): Promise<MediaWikiQueryItem.AllPages[]>
	async query( params: { list: 'categorymembers' } & ReducedRequest<MediaWikiQueryRequest.CategoryMembers>, limit?: number ): Promise<MediaWikiQueryItem.CategoryMembers[]>
	async query( params: { list: 'logevents' } & ReducedRequest<MediaWikiQueryRequest.LogEvents>, limit?: number ): Promise<MediaWikiQueryItem.LogEvents[]>
	async query( params: { list: 'recentchanges' } & ReducedRequest<MediaWikiQueryRequest.RecentChanges>, limit?: number ): Promise<MediaWikiQueryItem.RecentChanges[]>
	async query( params: { list: 'usercontribs' } & ReducedRequest<MediaWikiQueryRequest.UserContribs>, limit?: number ): Promise<MediaWikiQueryItem.UserContribs[]>
	async query( params: { list: 'users' } & ReducedRequest<MediaWikiQueryRequest.Users>, limit?: number ): Promise<MediaWikiQueryItem.Users[]>
	async query( params: { list: string } & ReducedRequest<MediaWikiQueryRequest.QueryRequest>, limit?: number ): Promise<MediaWikiQueryItem.QueryItem[]> {
		const result: MediaWikiQueryItem.QueryItem[] = []

		// eslint-disable-next-line no-constant-condition
		while ( true ) {
			const req = await this.get<MediaWikiQueryResponses.QueryResponse<string, string, MediaWikiQueryItem.QueryItem>>( {
				action: 'query',
				...params
			} )

			const results = req.query[ params.list ]
			if ( results ) {
				for ( const item of results ) {
					result.push( item )
					if ( limit && result.length === limit ) {
						return result
					}
				}
			}

			if ( !req.continue ) break

			const continuekey = Object.keys( req.continue ).find( i => i !== 'continue' )
			if ( !continuekey ) break
			// @ts-expect-error - faulty typing i don't know how to fix
			params[ continuekey ] = req.continue[ continuekey ]
		}

		return result
	}

	async *iterPages( titles: string[] ): AsyncGenerator<MediaWikiResponse.Revisions[ 'query' ][ 'pages' ][ 0 ], void, unknown> {
		while ( titles.length !== 0 ) {
			const res = await this.get<MediaWikiResponse.Revisions>( {
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

	iterQuery( params: { list: 'allcategories' } & ReducedRequest<MediaWikiQueryRequest.AllCategories>, limit?: number ): AsyncGenerator<MediaWikiQueryItem.AllCategories, void, unknown>
	iterQuery( params: { list: 'allimages' } & ReducedRequest<MediaWikiQueryRequest.AllImages>, limit?: number ): AsyncGenerator<MediaWikiQueryItem.AllImages, void, unknown>
	iterQuery( params: { list: 'allpages' } & ReducedRequest<MediaWikiQueryRequest.AllPages>, limit?: number ): AsyncGenerator<MediaWikiQueryItem.AllPages, void, unknown>
	iterQuery( params: { list: 'categorymembers' } & ReducedRequest<MediaWikiQueryRequest.CategoryMembers>, limit?: number ): AsyncGenerator<MediaWikiQueryItem.CategoryMembers, void, unknown>
	iterQuery( params: { list: 'logevents' } & ReducedRequest<MediaWikiQueryRequest.LogEvents>, limit?: number ): AsyncGenerator<MediaWikiQueryItem.LogEvents, void, unknown>
	iterQuery( params: { list: 'recentchanges' } & ReducedRequest<MediaWikiQueryRequest.RecentChanges>, limit?: number ): AsyncGenerator<MediaWikiQueryItem.RecentChanges, void, unknown>
	iterQuery( params: { list: 'usercontribs' } & ReducedRequest<MediaWikiQueryRequest.UserContribs>, limit?: number ): AsyncGenerator<MediaWikiQueryItem.UserContribs, void, unknown>
	iterQuery( params: { list: 'users' } & ReducedRequest<MediaWikiQueryRequest.Users>, limit?: number ): AsyncGenerator<MediaWikiQueryItem.Users, void, unknown>
	async *iterQuery( params: { list: string } & ReducedRequest<MediaWikiQueryRequest.QueryRequest>, limit?: number ): AsyncGenerator<MediaWikiQueryItem.QueryItem, void, unknown> {
		let counter = 0
		// eslint-disable-next-line no-constant-condition
		while ( true ) {
			const req = await this.get<MediaWikiQueryResponses.QueryResponse<string, string, MediaWikiQueryItem.QueryItem>>( {
				action: 'query',
				...params
			} )

			const results = req.query[ params.list ]
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
