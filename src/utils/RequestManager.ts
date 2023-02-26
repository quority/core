import { Cookie, CookieJar, type Store } from 'tough-cookie'
import { type Agent, type Dispatcher, FormData, request } from 'undici'
import type fs from 'fs'
import { type IncomingHttpHeaders } from 'http'

type RequestOptions = Omit<Dispatcher.RequestOptions, 'path'>
type Response = Dispatcher.ResponseData

export interface RequestManagerOptions {
	agent?: Agent
	allowedCookies?: RegExp[]
	headers?: IncomingHttpHeaders
	jar?: {
		store?: Store
		options?: CookieJar.Options
	}
}

export class RequestManager {
	protected jar: CookieJar
	public readonly options: RequestManagerOptions

	public constructor( options: RequestManagerOptions = {} ) {
		this.jar = new CookieJar( options.jar?.store, options.jar?.options )
		this.options = options
	}

	public clear(): void {
		this.jar.removeAllCookiesSync()
	}

	public async get( url: string | URL, qs: Record<string, string> = {} ): Promise<unknown> {
		const params = new URLSearchParams( qs )
		const { body, headers } = await this.raw( new URL( `?${ params }`, url ) )

		const cookies: string[] = headers[ 'set-cookie' ] || []
		this.addCookies( url, cookies )

		return body.json()
	}

	public async post( url: string | URL, form: Record<string, string | fs.ReadStream> = {} ): Promise<unknown> {
		const formData = new FormData()
		for ( const prop in form ) {
			formData.set( prop, form[ prop ] )
		}

		const { body, headers } = await this.raw( url, {
			body: formData,
			method: 'POST'
		} )

		this.addCookies( url, headers[ 'set-cookie' ] )

		return body.json()
	}

	public raw( url: string | URL, fetchOptions: RequestOptions = { method: 'GET' } ): Promise<Response> {
		return request( url, {
			...fetchOptions,
			dispatcher: this.options.agent,
			headers: {
				...this.options.headers,
				cookie: this.jar.getCookieStringSync( typeof url === 'string' ? url : url.href )
			}
		} )
	}

	public addCookies( url: string | URL, headers: string | string[] | undefined ): void {
		if ( typeof headers === 'string' ) headers = [ headers ]
		if ( !headers?.length ) return

		const stringUrl = typeof url === 'string' ? url : url.href
		let cookies = headers.map( cookie => Cookie.parse( cookie ) )

		if ( this.options.allowedCookies ) {
			const isAllowed = ( cookie: Cookie | undefined ) => cookie && this.options.allowedCookies?.some( regex => cookie.key.match( regex ) )
			cookies = cookies.filter( isAllowed )
		}

		cookies.forEach( cookie => {
			if ( cookie ) {
				this.jar.setCookieSync( cookie, stringUrl )
			}
		} )
	}
}
