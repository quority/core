import { CookieJar, type ICookieJarOptions } from './CookieJar'
import { type Agent, type Dispatcher, FormData, request } from 'undici'
import type fs from 'fs'
import { type IncomingHttpHeaders } from 'http'

type RequestOptions = Omit<Dispatcher.RequestOptions, 'path'>
type Response = Dispatcher.ResponseData

export interface RequestManagerOptions {
	agent?: Agent
	headers?: IncomingHttpHeaders
	jarOptions?: ICookieJarOptions
}

export class RequestManager {
	public agent: Agent | undefined
	public headers: IncomingHttpHeaders
	protected jar: CookieJar

	public constructor( { agent, headers, jarOptions }: RequestManagerOptions = {} ) {
		this.agent = agent
		this.jar = new CookieJar( jarOptions )
		this.headers = headers ?? {}
	}

	public clear( url: URL ): void {
		this.jar.clear( url )
	}

	public async get<T extends Record<string, unknown>>( { url, qs }: { url: URL, qs: Record<string, string> } ): Promise<T> {
		const params = new URLSearchParams( qs )
		const { body, headers } = await this.raw( new URL( `?${ params }`, url ) )

		const cookies: string[] = headers[ 'set-cookie' ] || []
		this.addCookies( url, cookies )

		return body.json() as unknown as T
	}

	public async post<T extends Record<string, unknown>>( { url, form }: { url: URL, form: Record<string, string | fs.ReadStream> } ): Promise<T> {
		const formData = new FormData()
		for ( const prop in form ) {
			formData.set( prop, form[ prop ] )
		}

		const { body, headers } = await this.raw( url, {
			body: formData,
			method: 'POST'
		} )

		this.addCookies( url, headers[ 'set-cookie' ] )

		return body.json() as unknown as T
	}

	public raw( url: URL, fetchOptions: RequestOptions = { method: 'GET' } ): Promise<Response> {
		return request( url, {
			...fetchOptions,
			dispatcher: this.agent,
			headers: {
				...this.headers,
				cookie: this.jar.get( url )
			}
		} )
	}

	private addCookies( url: URL, cookies: string | string[] | undefined ): void {
		if ( !cookies ) return
		const cookiesList = Array.isArray( cookies ) ? cookies : [ cookies ]
		for ( const cookie of cookiesList ) {
			this.jar.set( {
				cookie,
				url
			} )
		}
	}
}
