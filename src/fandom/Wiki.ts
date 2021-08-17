import {
	Logger, RequestManager
} from '../utils'
import {
	MWResponses, QueryRequests, QueryResponses, TokenType
} from '../types'
import {
	InvalidInterwikiError
} from '../errors'
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
	namespaces?: Record<`${ number }`, MWResponses.SiteInfoNamespace>
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
				result[ iw.prefix ] = Wiki.url2interwiki( iw.url )
			} catch ( e ) {
				Logger.error( `An error occurred when processing "${ iw.prefix }" interwiki: ${ iw.url }. It will be skipped.` )
			}
		}

		return result
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

	getSiteinfo(): Promise<MWResponses.SiteInfo> {
		return this.get<MWResponses.SiteInfo>( {
			action: 'query',
			meta: 'siteinfo',
			siprop: 'general|namespaces|variables'
		} )
	}

	async getToken<Token extends TokenType>( type: Token ): Promise<MWResponses.Tokens<Token>> {
		const req = await this.get<MWResponses.Tokens<Token>>( {
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

	async query( params: { list: 'allcategories' } & QueryRequests.AllCategories ): Promise<QueryResponses.QueryItem.AllCategories[]>
	async query( params: { list: 'allimages' } & QueryRequests.AllImages ): Promise<QueryResponses.QueryItem.AllImages[]>
	async query( params: { list: 'allpages' } & QueryRequests.AllPages ): Promise<QueryResponses.QueryItem.AllPages[]>
	async query( params: { list: 'categorymembers' } & QueryRequests.CategoryMembers ): Promise<QueryResponses.QueryItem.CategoryMembers[]>
	async query( params: { list: 'recentchanges' } & QueryRequests.RecentChanges ): Promise<QueryResponses.QueryItem.RecentChanges[]>
	async query( params: { list: 'usercontribs' } & QueryRequests.UserContribs ): Promise<QueryResponses.QueryItem.UserContribs[]>
	async query( params: { list: 'users' } & QueryRequests.Users ): Promise<QueryResponses.QueryItem.Users[]>
	async query( params: { list: string } & QueryRequests.ApiQuery ): Promise<QueryResponses.QueryItem.ApiQuery[]> {
		const result: QueryResponses.QueryItem.ApiQuery[] = []

		// eslint-disable-next-line no-constant-condition
		while ( true ) {
			const req = await this.get<QueryResponses.ApiQuery<string, string, QueryResponses.QueryItem.ApiQuery>>( {
				action: 'query',
				...params
			} )

			for ( const item of req.query[ params.list ] ) {
				result.push( item )
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

	iterQuery( params: { list: 'allcategories' } & QueryRequests.AllCategories ): AsyncGenerator<QueryResponses.QueryItem.AllCategories, void, unknown>
	iterQuery( params: { list: 'allimages' } & QueryRequests.AllImages ): AsyncGenerator<QueryResponses.QueryItem.AllImages, void, unknown>
	iterQuery( params: { list: 'allpages' } & QueryRequests.AllPages ): AsyncGenerator<QueryResponses.QueryItem.AllPages, void, unknown>
	iterQuery( params: { list: 'categorymembers' } & QueryRequests.CategoryMembers ): AsyncGenerator<QueryResponses.QueryItem.CategoryMembers, void, unknown>
	iterQuery( params: { list: 'recentchanges' } & QueryRequests.RecentChanges ): AsyncGenerator<QueryResponses.QueryItem.RecentChanges, void, unknown>
	iterQuery( params: { list: 'usercontribs' } & QueryRequests.UserContribs ): AsyncGenerator<QueryResponses.QueryItem.UserContribs, void, unknown>
	iterQuery( params: { list: 'users' } & QueryRequests.Users ): AsyncGenerator<QueryResponses.QueryItem.Users, void, unknown>
	async *iterQuery( params: { list: string } & QueryRequests.ApiQuery ): AsyncGenerator<QueryResponses.QueryItem.ApiQuery, void, unknown> {
		// eslint-disable-next-line no-constant-condition
		while ( true ) {
			const req = await this.get<QueryResponses.ApiQuery<string, string, QueryResponses.QueryItem.ApiQuery>>( {
				action: 'query',
				...params
			} )

			for ( const item of req.query[ params.list ] ) {
				yield item
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
