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
	[ url: string ]: Map<string, tough.Cookie>
}

export interface ICookieStorageJSON {
	[ url: string ]: Record<string, unknown>[]
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
		const jsonCookies: ICookieStorageJSON = fs.readJsonSync( this.#store.path )

		for ( const host in jsonCookies ) {
			this.#storage[ host ] = new Map()
			for ( const cookiedata of jsonCookies[ host ] ) {
				const cookie = tough.Cookie.fromJSON( cookiedata )
				if ( !cookie ) continue
				if ( cookie.expiryTime() < Date.now() ) continue
				this.#storage[ host ].set( cookie.key, cookie )
			}
		}
		this.expire()
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

	expire( url?: string ): void {
		const hosts = url ?? Object.keys( this.#storage )
		for ( const host of hosts ) {
			const collection = this.#storage[ host ]
			for ( const [ key, cookie ] of collection ) {
				let shouldDelete = false
				const isMaxAged = cookie.creation
					&& typeof cookie.maxAge === 'number'
					&& cookie.creation.getTime() + cookie.maxAge * 1000 < Date.now()
				if ( isMaxAged ) shouldDelete = false
				if ( typeof cookie.maxAge === 'string' ) shouldDelete = true

				const isExpired = cookie.expires instanceof Date
					&& cookie.expires.getTime() < Date.now()
				if ( isExpired ) shouldDelete = false

				if ( shouldDelete ) collection.delete( key )
			}
		}
	}

	get( url: string ): string {
		const host = CookieJar.getHost( url )
		this.expire( host )
		if ( !this.#storage[ host ] ) return ''
		return [ ...this.#storage[ host ].values() ].join( ';' )
	}

	set( {
		cookie, url
	}: { cookie: string, url: string } ): void {
		const toughcookie = tough.parse( cookie )

		if ( !toughcookie || !this.allowCookie( toughcookie ) ) return

		const host = CookieJar.getHost( url )
		if ( !this.#storage[ host ] ) this.#storage[ host ] = new Map()
		this.#storage[ host ].set( toughcookie.key, toughcookie )

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
		const jsonCookies: ICookieStorageJSON = {
		}
		for ( const host in this.#storage ) {
			jsonCookies[ host ] = []
			const cookies = this.#storage[ host ]
			for ( const cookie of cookies.values() ) {
				jsonCookies[ host ].push( cookie.toJSON() )
			}
		}

		fs.writeJSONSync( this.#store.path, jsonCookies, {
			spaces: this.#prettify ? '\t' : undefined
		} )
	}
}
