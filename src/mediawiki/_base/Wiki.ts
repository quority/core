import {
	Logger,
	RequestManager
} from '../../utils'
import {
	MWResponses, QueryRequests, QueryResponses, SiteInfo, TokenType
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

	async get<T>( params: Record<string, string | string[] | number | number[] | boolean | undefined> ): Promise<T> {
		params.format = 'json'
		params.formatversion = '2'

		const qs: Record<string, string> = {
		}

		for ( const prop in params ) {
			if ( !params[prop] ) {
				continue
			} else if ( typeof params[prop] === 'boolean' ) {
				qs[ prop ] = params[prop] ? '1' : '0'
			} else if ( Array.isArray( params[prop] ) ) {
				qs[ prop ] = ( params[prop] as unknown[] ).join( '|' )
			} else {
				qs[ prop ] = `${ params[prop] }`
			}
		}

		const res = await this.request.get<T>( {
			qs,
			url: this.api
		} )

		return res
	}

	async post<T>( params: Record<string, string | string[] | number | number[] | boolean | fs.ReadStream | undefined> ): Promise<T> {
		params.format = 'json'
		params.formatversion = '2'

		const qs: Record<string, string | fs.ReadStream> = {
		}

		for ( const prop in params ) {
			if ( !params[prop] ) {
				continue
			} else if ( params[prop] instanceof fs.ReadStream ) {
				qs[ prop ] = params[prop] as fs.ReadStream
			} else if ( typeof params[prop] === 'boolean' ) {
				qs[ prop ] = params[prop] ? '1' : '0'
			} else if ( Array.isArray( params[prop] ) ) {
				qs[ prop ] = ( params[prop] as unknown[] ).join( '|' )
			} else {
				qs[ prop ] = `${ params[prop] }`
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
		const req = await this.get<MWResponses.InterwikiMap>( {
			action: 'query',
			meta: 'siteinfo',
			siprop: 'interwikimap'
		} )

		const interwikis = req.query.interwikimap.filter( i => i.language )

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

	getSiteInfo<T extends SiteInfo.WikiLoadable>( ...properties: T[] ): Promise<SiteInfo.SiteInfo<SiteInfo.SiteInfoQuery, T>> {
		return this.get( {
			action: 'query',
			meta: 'siteinfo',
			siprop: properties.join( '|' )
		} )
	}

	async getPages( _titles: string ): Promise<MWResponses.RevisionsItem>
	async getPages( _titles: string[] ): Promise<MWResponses.RevisionsItem[]>
	async getPages( _titles: string | string[] ): Promise<MWResponses.RevisionsItem | MWResponses.RevisionsItem[]> {
		const titles = Array.isArray( _titles ) ? _titles : [ _titles ]

		const pages: MWResponses.RevisionsItem[] = []

		while ( titles.length !== 0 ) {
			const res = await this.get<MWResponses.Revisions>( {
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

	async getToken<Token extends TokenType>( type: Token ): Promise<MWResponses.Tokens<Token>> {
		const req = await this.get<MWResponses.Tokens<Token>>( {
			action: 'query',
			meta: 'tokens',
			type
		} )

		return req
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
			const res = await this.get<MWResponses.Revisions>( {
				action: 'query',
				prop: 'revisions',
				rvprop: 'content',
				rvslots: 'main',
				titles: titles.splice( 0, 25 ).join( '|' )
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
			const req = await this.post<MWResponses.Purge>( {
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

	async query( params: { list: 'allcategories' } & QueryRequests.AllCategories, limit?: number ): Promise<QueryResponses.QueryItem.AllCategories[]>
	async query( params: { list: 'allimages' } & QueryRequests.AllImages, limit?: number ): Promise<QueryResponses.QueryItem.AllImages[]>
	async query( params: { list: 'allpages' } & QueryRequests.AllPages, limit?: number ): Promise<QueryResponses.QueryItem.AllPages[]>
	async query( params: { list: 'categorymembers' } & QueryRequests.CategoryMembers, limit?: number ): Promise<QueryResponses.QueryItem.CategoryMembers[]>
	async query( params: { list: 'logevents' } & QueryRequests.LogEvents, limit?: number ): Promise<QueryResponses.QueryItem.LogEvents[]>
	async query( params: { list: 'recentchanges' } & QueryRequests.RecentChanges, limit?: number ): Promise<QueryResponses.QueryItem.RecentChanges[]>
	async query( params: { list: 'usercontribs' } & QueryRequests.UserContribs, limit?: number ): Promise<QueryResponses.QueryItem.UserContribs[]>
	async query( params: { list: 'users' } & QueryRequests.Users, limit?: number ): Promise<QueryResponses.QueryItem.Users[]>
	async query( params: { list: string } & QueryRequests.ApiQuery, limit?: number ): Promise<QueryResponses.QueryItem.ApiQuery[]>
	async query( params: { list: string } & QueryRequests.ApiQuery, limit?: number ): Promise<QueryResponses.QueryItem.ApiQuery[]> {
		const result: QueryResponses.QueryItem.ApiQuery[] = []

		// eslint-disable-next-line no-constant-condition
		while ( true ) {
			const req = await this.get<QueryResponses.ApiQuery<string, string, QueryResponses.QueryItem.ApiQuery>>( {
				action: 'query',
				...params
			} )

			for ( const item of req.query[ params.list ] ) {
				result.push( item )
				if ( limit && result.length === limit ) {
					return result
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

	async *iterPages( titles: string[] ): AsyncGenerator<MWResponses.RevisionsItem, void, unknown> {
		while ( titles.length !== 0 ) {
			const res = await this.get<MWResponses.Revisions>( {
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

	iterQuery( params: { list: 'allcategories' } & QueryRequests.AllCategories, limit?: number ): AsyncGenerator<QueryResponses.QueryItem.AllCategories, void, unknown>
	iterQuery( params: { list: 'allimages' } & QueryRequests.AllImages, limit?: number ): AsyncGenerator<QueryResponses.QueryItem.AllImages, void, unknown>
	iterQuery( params: { list: 'allpages' } & QueryRequests.AllPages, limit?: number ): AsyncGenerator<QueryResponses.QueryItem.AllPages, void, unknown>
	iterQuery( params: { list: 'categorymembers' } & QueryRequests.CategoryMembers, limit?: number ): AsyncGenerator<QueryResponses.QueryItem.CategoryMembers, void, unknown>
	iterQuery( params: { list: 'logevents' } & QueryRequests.LogEvents, limit?: number ): AsyncGenerator<QueryResponses.QueryItem.LogEvents, void, unknown>
	iterQuery( params: { list: 'recentchanges' } & QueryRequests.RecentChanges, limit?: number ): AsyncGenerator<QueryResponses.QueryItem.RecentChanges, void, unknown>
	iterQuery( params: { list: 'usercontribs' } & QueryRequests.UserContribs, limit?: number ): AsyncGenerator<QueryResponses.QueryItem.UserContribs, void, unknown>
	iterQuery( params: { list: 'users' } & QueryRequests.Users, limit?: number ): AsyncGenerator<QueryResponses.QueryItem.Users, void, unknown>
	iterQuery( params: { list: string } & QueryRequests.ApiQuery, limit?: number ): AsyncGenerator<QueryResponses.QueryItem.ApiQuery, void, unknown>
	async *iterQuery( params: { list: string } & QueryRequests.ApiQuery, limit?: number ): AsyncGenerator<QueryResponses.QueryItem.ApiQuery, void, unknown> {
		let counter = 0
		// eslint-disable-next-line no-constant-condition
		while ( true ) {
			const req = await this.get<QueryResponses.ApiQuery<string, string, QueryResponses.QueryItem.ApiQuery>>( {
				action: 'query',
				...params
			} )

			for ( const item of req.query[ params.list ] ) {
				yield item
				counter++
				if ( limit && counter === limit ) {
					return
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
