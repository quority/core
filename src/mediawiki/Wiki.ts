import fs from 'fs'
import { MediaWikiError } from '../errors'
import { BaseStrategy } from '../strategies'
import type { ListQuery, NoActionToken, OpenSearchRequest, OpenSearchResponse, ParseRequest, ParseResponse, PropQuery, PurgeRequest, RevisionsRequest, RevisionsResponse, SiteInfoRequest, SiteInfoResponse, TokensRequest, TokensResponse, TokenType } from '../types'
import { RequestManager } from '../utils'
import { Bot } from './Bot'

export type StrategyName = 'base' | 'fandom'

export interface WikiOptions<S extends typeof BaseStrategy> {
	api: string
	platform?: S
	request?: RequestManager
}

export class Wiki<S extends BaseStrategy> {
	public readonly api: URL
	public readonly custom: S[ 'custom' ]
	public readonly request: RequestManager = new RequestManager()
	public readonly platform: S

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public constructor( options: WikiOptions<( new ( ...args: any ) => S ) & { getApi: ( api: string ) => URL }> ) {
		if ( options.request ) this.request = options.request

		const platform = options.platform ?? BaseStrategy
		this.api = platform.getApi( options.api )

		this.platform = new platform( this ) as S
		this.custom = this.platform.custom
	}

	protected querystring<T extends Record<string, unknown>>( params: T ): Record<keyof T, string | fs.ReadStream> {
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

	protected async raw( userparams: Record<string, unknown>, method: 'GET' | 'POST' ): Promise<unknown> {
		const qs = this.querystring( {
			...userparams,
			format: 'json',
			formatversion: 2
		} )

		const response = method === 'GET'
			? await this.request.get( this.api, qs as Record<string, string> )
			: await this.request.post( this.api, qs )

		if ( typeof response === 'object' && response && 'error' in response ) {
			throw new MediaWikiError( response.error )
		}

		return response
	}

	public get( userparams: Record<string, unknown> ): Promise<unknown> {
		return this.raw( userparams, 'GET' )
	}

	public post( userparams: Record<string, unknown> ): Promise<unknown> {
		return this.raw( userparams, 'POST' )
	}

	public async exists(): Promise<boolean> {
		const { statusCode } = await this.request.raw( this.api, { method: 'HEAD' } )
		return statusCode >= 200 && statusCode < 300
	}

	public async getInterwikis(): Promise<Record<string, string>> {
		const req = await this.get( {
			action: 'query',
			meta: 'siteinfo',
			siprop: 'interwikimap'
		} ) as SiteInfoResponse

		const interwikis = req.query.interwikimap.filter( i => 'language' in i )
		const result: Record<string, string> = {}
		for ( const iw of interwikis ) {
			result[ iw.prefix ] = iw.url
		}
		return result
	}

	public getSiteInfo( ...properties: Array<keyof SiteInfoResponse[ 'query' ]> ): Promise<SiteInfoResponse> {
		return this.get( {
			action: 'query',
			meta: 'siteinfo',
			siprop: properties
		} satisfies SiteInfoRequest ) as Promise<SiteInfoResponse>
	}

	public async getPage( title: string ): Promise<string> {
		const req = await this.get( {
			action: 'query',
			prop: 'revisions',
			rvprop: 'content',
			rvslots: 'main',
			titles: title
		} satisfies RevisionsRequest ) as RevisionsResponse

		const [ page ] = req.query.pages
		if ( !page || page.missing ) return ''
		return page.revisions[ 0 ].slots.main.content
	}

	public async getPages<T extends string>( titles: T[], keepMissing = false ): Promise<{ [ key in T ]?: string }> {
		const pages: { [ key in T ]?: string } = {}

		for ( let i = 0; i < titles.length; i += 50 ) {
			const res = await this.get( {
				action: 'query',
				prop: 'revisions',
				rvprop: 'content',
				rvslots: 'main',
				titles: titles.slice( i, 50 )
			} satisfies RevisionsRequest ) as RevisionsResponse

			for ( const page of res.query.pages ) {
				if ( page.missing && keepMissing ) {
					pages[ page.title as T ] = ''
				} else if ( !page.missing ) {
					pages[ page.title as T ] = page.revisions[ 0 ].slots.main.content
				}
			}
		}

		return pages
	}

	public async getToken<Token extends TokenType>( type: Token ): Promise<TokensResponse<Token>> {
		const req = await this.get( {
			action: 'query',
			meta: 'tokens',
			type
		} satisfies TokensRequest ) as TokensResponse<Token>

		return req
	}

	public getUrl( title: string ): URL {
		if ( this.api.pathname.startsWith( '/w/' ) ) {
			return new URL( `../wiki/${ title }`, this.api )
		} else {
			return new URL( `./wiki/${ title }`, this.api )
		}
	}

	public parse( params: NoActionToken<ParseRequest> ): Promise<ParseResponse> {
		return this.get( {
			...params,
			action: 'parse'
		} ) as Promise<ParseResponse>
	}

	public async purge( titles: string[] ): Promise<void> {
		for ( let i = 0; i < titles.length; i += 50 ) {
			await this.post( {
				action: 'purge',
				titles: titles.slice( i, 50 )
			} satisfies PurgeRequest )
		}
	}

	public search( params: NoActionToken<OpenSearchRequest> ): Promise<OpenSearchResponse> {
		return this.get( {
			...params,
			action: 'opensearch'
		} satisfies OpenSearchRequest ) as Promise<OpenSearchResponse>
	}

	public async queryList<ListName extends keyof ListQuery = keyof ListQuery>( params: { list: ListName } & NoActionToken<ListQuery[ ListName ][ 0 ]>, limit?: number ): Promise<Array<ListQuery[ ListName ][ 2 ]>> {
		const generator = this.iterQueryList<ListName>( params, limit )
		const result: Array<ListQuery[ ListName ][ 2 ]> = []
		for await ( const item of generator ) {
			result.push( item )
		}
		return result
	}

	public async *iterQueryList<ListName extends keyof ListQuery = keyof ListQuery>( params: { list: ListName } & NoActionToken<ListQuery[ ListName ][ 0 ]>, limit?: number ): AsyncGenerator<ListQuery[ ListName ][ 2 ]> {
		let counter = 0
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while ( true ) {
			const req = await this.get( {
				...params,
				action: 'query'
			} ) as ListQuery[ ListName ][ 1 ] & { query: { [ key in ListName ]: Array<ListQuery[ ListName ][ 2 ]> } }

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

	public async queryProp<PropName extends keyof PropQuery = keyof PropQuery>( params: { prop: PropName } & NoActionToken<PropQuery[ PropName ][ 0 ]>, limit?: number ): Promise<Array<PropQuery[ PropName ][ 2 ]>> {
		const generator = this.iterQueryProp<PropName>( params, limit )
		const result: Array<PropQuery[ PropName ][ 2 ]> = []
		for await ( const item of generator ) {
			result.push( item )
		}
		return result.flat()
	}

	public async rawQueryProp<PropName extends keyof PropQuery = keyof PropQuery>( params: { prop: PropName } & NoActionToken<PropQuery[ PropName ][ 0 ]> ): Promise<PropQuery[ PropName ][ 1 ][ 'query' ]> {
		const res = await this.get( {
			...params,
			action: 'query'
		} ) as PropQuery[ PropName ][ 1 ]
		return res.query
	}

	public async *iterQueryProp<PropName extends keyof PropQuery = keyof PropQuery>( params: { prop: PropName } & NoActionToken<PropQuery[ PropName ][ 0 ]>, limit?: number ): AsyncGenerator<PropQuery[ PropName ][ 2 ]> {
		let counter = 0
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while ( true ) {
			const req = await this.get( {
				...params,
				action: 'query'
			} ) as PropQuery[ PropName ][ 1 ] & { query: { [ key in PropName ]: Array<PropQuery[ PropName ][ 2 ]> } }

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
			const res = await this.get( {
				action: 'query',
				prop: 'revisions',
				rvprop: [ 'content' ],
				rvslots: 'main',
				titles: titles.splice( 0, 50 ).join( '|' )
			} satisfies RevisionsRequest ) as RevisionsResponse

			for ( const page of res.query.pages ) {
				if ( page.missing === true ) {
					continue
				}

				yield page
			}
		}
	}

	public async login( username: string, password: string ): Promise<Bot<S>> {
		const bot = new Bot( {
			password,
			username,
			wiki: this
		} )
		await bot.login()
		return bot
	}
}
