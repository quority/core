import fetch, {
	Response
} from 'node-fetch'
import {
	CookieJar
} from './CookieJar'
import FormData from 'form-data'
import fs from 'fs'

export class RequestManager {
	#jar: CookieJar

	constructor( {
		jarOptions
	}: { jarOptions?: ConstructorParameters<typeof CookieJar>[0] } = {
	} ) {
		this.#jar = new CookieJar( jarOptions )
	}

	get jar(): Readonly<CookieJar> {
		return this.#jar
	}

	clear( url: string ): void {
		this.#jar.clear( url )
	}

	async get<T>( {
		url, qs
	}: { url: string, qs: Record<string, string> } ): Promise<T> {
		const params = new URLSearchParams( qs )
		const req = await fetch( `${ url }?${ params }`, {
			headers: {
				cookie: this.#jar.get( url )
			},
			method: 'GET'
		} )

		const cookies = req.headers.raw()[ 'set-cookie' ] || []
		for ( const cookie of cookies ) {
			this.#jar.set( {
				cookie, url
			} )
		}

		return req.json()
	}

	async post<T>( {
		url, form
	}: { url: string, form: Record<string, string | fs.ReadStream> } ): Promise<T> {
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
				cookie, url
			} )
		}

		return req.json()
	}

	raw( url: string ): Promise<Response> {
		return fetch( url, {
			headers: {
				cookie: this.#jar.get( url )
			},
			method: 'GET'
		} )
	}
}
