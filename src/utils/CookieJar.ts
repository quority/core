import fs from 'fs-extra'
import tough from 'tough-cookie'

declare module 'tough-cookie' {
	interface CookieJar {
		store: tough.Store
	}
}

export interface ICookieStoreOptions {
	regex: RegExp | RegExp[]
	path: string
}

export interface ICookieStorage {
	[ url: string ]: tough.Cookie[]
}

export class CookieJar {
	#storage: ICookieStorage
	#store?: ICookieStoreOptions
	#prettify: boolean

	constructor( {
		prettify, store
	}: { prettify?: boolean, store?: ICookieStoreOptions } = {
	} ) {
		this.#prettify = prettify ?? false
		this.#storage = {
		}
		this.#store = store

		if ( !this.#store || !fs.existsSync( this.#store.path ) ) return
		this.#storage = fs.readJsonSync( this.#store.path )

		for ( const host in this.#storage ) {
			this.#storage[ host ] = this.#storage[ host ]
				.map( cookie => tough.Cookie.fromJSON( cookie ) )
				.filter( ( cookie ): cookie is tough.Cookie => cookie !== null )
				.filter( cookie => Date.now() < cookie.expiryTime() )
		}
	}

	clear( url: string ): void {
		const host = CookieJar.getHost( url )
		if ( !this.#storage[ host ] ) return
		delete this.#storage[ host ]
	}

	clearAll(): void {
		this.#storage = {
		}
	}

	get( url: string ): string {
		const host = CookieJar.getHost( url )
		if ( !this.#storage[ host ] ) return ''
		return this.#storage[ host ].join( ';' )
	}

	set( {
		cookie, url
	}: { cookie: string, url: string } ): void {
		const toughcookie = tough.parse( cookie )

		if ( !toughcookie || !this.allowCookie( toughcookie ) ) return

		const host = CookieJar.getHost( url )
		if ( !this.#storage[ host ] ) this.#storage[ host ] = []
		this.#storage[ host ].push( toughcookie )

		this.save()
	}

	private allowCookie( cookie: tough.Cookie ): boolean {
		if ( !this.#store?.regex ) return true
		const regexes = Array.isArray( this.#store.regex ) ? this.#store.regex : [ this.#store.regex ]
		const match = regexes.find( regex => cookie.key.match( regex ) )
		return match !== undefined
	}

	private static getHost( url: string ): string {
		const {
			host, pathname
		} = new URL( url )
		const lang = pathname.match( /\/([a-z-]+)\// )?.[1]

		if ( lang ) {
			return `${ host }/${ lang }`
		}
		return host
	}

	private save(): void {
		if ( !this.#store ) return

		fs.ensureFileSync( this.#store.path )
		fs.writeJSONSync( this.#store.path, this.#storage, {
			spaces: this.#prettify ? '\t' : undefined
		} )
	}
}
