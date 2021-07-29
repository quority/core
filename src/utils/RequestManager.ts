import fetch, {
	Response
} from 'node-fetch'
import FormData from 'form-data'
import fs from 'fs'
import tough from 'tough-cookie'

export class RequestManager {
	#jar = new tough.CookieJar()

	async get<T>( {
		url, qs
	}: { url: string, qs: Record<string, string> } ): Promise<T> {
		const params = new URLSearchParams( qs )
		const req = await fetch( `${ url }?${ params }`, {
			headers: {
				cookie: this.#jar.getCookieStringSync( url )
			},
			method: 'GET'
		} )

		const cookies = req.headers.raw()[ 'set-cookie' ] || []
		for ( const cookie of cookies ) {
			this.#jar.setCookieSync( cookie, url )
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
				cookie: this.#jar.getCookieStringSync( url )
			},
			method: 'POST'
		} )

		const cookies = req.headers.raw()[ 'set-cookie' ] || []
		for ( const cookie of cookies ) {
			this.#jar.setCookieSync( cookie, url )
		}

		return req.json()
	}

	raw( url: string ): Promise<Response> {
		return fetch( url, {
			headers: {
				cookie: this.#jar.getCookieStringSync( url )
			},
			method: 'GET'
		} )
	}
}
