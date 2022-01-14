import { CookieJar } from './CookieJar'
import fetch from 'node-fetch'
import FormData from 'form-data'
import type fs from 'fs'
import type { ICookieJarOptions } from './CookieJar'
import type { Response } from 'node-fetch'

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
		const req = await fetch( `${ url }?${ params }`, {
			headers: {
				cookie: this.#jar.get( url )
			},
			method: 'GET'
		} )

		const cookies = req.headers.raw()[ 'set-cookie' ] ?? []
		for ( const cookie of cookies ) {
			this.#jar.set( {
				cookie,
				url
			} )
		}

		return req.json() as unknown as T
	}

	public async post<T>( { url, form }: { url: string, form: Record<string, string | fs.ReadStream> } ): Promise<T> {
		const formData = new FormData()
		for ( const prop in form ) {
			formData.append( prop, form[ prop ] )
		}

		const req = await fetch( url, {
			body: formData,
			headers: {
				cookie: this.#jar.get( url )
			},
			method: 'POST'
		} )

		const cookies = req.headers.raw()[ 'set-cookie' ] || []
		for ( const cookie of cookies ) {
			this.#jar.set( {
				cookie,
				url
			} )
		}

		return req.json() as unknown as T
	}

	public raw( url: string ): Promise<Response> {
		return fetch( url, {
			headers: {
				cookie: this.#jar.get( url )
			},
			method: 'GET'
		} )
	}
}
