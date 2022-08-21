import { CookieJar, type ICookieJarOptions } from './CookieJar'
import { type Dispatcher, FormData, request } from 'undici'
import type { Agent } from 'undici'
import type fs from 'fs'
import { type IncomingHttpHeaders } from 'http'

type RequestOptions = Omit<Dispatcher.RequestOptions, 'path'>
type Response = Dispatcher.ResponseData

export class RequestManager {
	public agent: Agent | undefined
	#jar: CookieJar
	public headers: IncomingHttpHeaders

	public constructor( { agent, headers, jarOptions }: { agent?: Agent, headers?: IncomingHttpHeaders, jarOptions?: ICookieJarOptions } = {} ) {
		this.agent = agent
		this.#jar = new CookieJar( jarOptions )
		this.headers = headers ?? {}
	}

	public get jar(): Readonly<CookieJar> {
		return this.#jar
	}

	public clear( url: string ): void {
		this.#jar.clear( url )
	}

	public async get<T>( { url, qs }: { url: string, qs: Record<string, string> } ): Promise<T> {
		const params = new URLSearchParams( qs )
		const { body, headers } = await this.raw( `${ url }?${ params }` )

		const cookies: string[] = headers[ 'set-cookie' ] || []
		this.addCookies( url, cookies )

		return body.json() as unknown as T
	}

	public async post<T>( { url, form }: { url: string, form: Record<string, string | fs.ReadStream> } ): Promise<T> {
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

	public raw( url: string, fetchOptions: RequestOptions = { method: 'GET' } ): Promise<Response> {
		return request( url, {
			...fetchOptions,
			dispatcher: this.agent,
			headers: {
				...this.headers,
				cookie: this.#jar.get( url )
			}
		} )
	}

	private addCookies( url: string, cookies: string | string[] | undefined ): void {
		if ( !cookies ) return
		const cookiesList = Array.isArray( cookies ) ? cookies : [ cookies ]
		for ( const cookie of cookiesList ) {
			this.#jar.set( {
				cookie,
				url
			} )
		}
	}
}
