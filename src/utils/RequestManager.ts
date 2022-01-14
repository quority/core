import type { RequestInit, Response } from 'node-fetch'
import { CookieJar } from './CookieJar'
import fetch from 'node-fetch'
import FormData from 'form-data'
import type fs from 'fs'
import type { ICookieJarOptions } from './CookieJar'

export class RequestManager {
	#jar: CookieJar

	public constructor( { jarOptions }: { jarOptions?: ICookieJarOptions } = {} ) {
		this.#jar = new CookieJar( jarOptions )
	}

	public get jar(): Readonly<CookieJar> {
		return this.#jar
	}

	public clear( url: string ): void {
		this.#jar.clear( url )
	}

	public async get<T>( { url, qs }: { url: string, qs: Record<string, string> } ): Promise<T> {
		const params = new URLSearchParams( qs )
		const req = await this.raw( `${ url }?${ params }` )

		const cookies = req.headers.raw()[ 'set-cookie' ] ?? []
		this.addCookies( url, cookies )

		return req.json() as unknown as T
	}

	public async post<T>( { url, form }: { url: string, form: Record<string, string | fs.ReadStream> } ): Promise<T> {
		const formData = new FormData()
		for ( const prop in form ) {
			formData.append( prop, form[ prop ] )
		}

		const req = await this.raw( url, {
			body: formData,
			method: 'POST'
		} )

		const cookies = req.headers.raw()[ 'set-cookie' ] || []
		this.addCookies( url, cookies )

		return req.json() as unknown as T
	}

	public raw( url: string, fetchOptions: RequestInit = {} ): Promise<Response> {
		fetchOptions.method ??= 'GET'

		return fetch( url, {
			...fetchOptions,
			headers: {
				cookie: this.#jar.get( url )
			}
		} )
	}

	private addCookies( url: string, cookies: string[] ): void {
		for ( const cookie of cookies ) {
			this.#jar.set( {
				cookie,
				url
			} )
		}
	}
}
