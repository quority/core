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
	[ url: string ]: Array<Record<string, unknown>>
}

export interface ICookieJarOptions {
	prettify?: boolean
	store?: ICookieStoreOptions | undefined
}

export class CookieJar {
	#storage: ICookieStorage
	#store?: ICookieStoreOptions
	#prettify: boolean

	public constructor( { prettify = false, store }: ICookieJarOptions = {} ) {
		this.#prettify = prettify
		this.#storage = {}
		if ( store ) this.#store = store

		if ( !this.#store || !fs.existsSync( this.#store.path ) ) return
		const jsonCookies = fs.readJsonSync( this.#store.path ) as ICookieStorageJSON

		for ( const host in jsonCookies ) {
			this.#storage[ host ] = new Map()
			const hostCookies = jsonCookies[ host ]
			if ( !hostCookies ) continue
			for ( const cookiedata of hostCookies ) {
				const cookie = tough.Cookie.fromJSON( cookiedata )
				if ( !cookie ) continue
				if ( cookie.expiryTime() < Date.now() ) continue
				this.#storage[ host ]?.set( cookie.key, cookie )
			}
		}
		this.expire()
	}

	public clear( url: URL ): void {
		const host = CookieJar.getHost( url )
		if ( !this.#storage[ host ] ) return
		this.#storage[ host ]?.clear()
	}

	public clearAll(): void {
		this.#storage = {}
	}

	public expire( url?: URL ): void {
		const hosts = url
			? [ CookieJar.getHost( url ) ]
			: Object.keys( this.#storage )
		for ( const host of hosts ) {
			const collection = this.#storage[ host ]
			if ( !collection ) continue
			for ( const [
				key, cookie
			] of collection ) {
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

	public get( url: URL ): string {
		const host = CookieJar.getHost( url )
		this.expire( url )
		const storage = this.#storage[ host ]
		if ( !storage ) return ''
		return [ ...storage.values() ].join( ';' )
	}

	public set( { cookie, url }: { cookie: string, url: URL } ): void {
		const toughcookie = tough.parse( cookie )

		if ( !toughcookie || !this.allowCookie( toughcookie ) ) return

		const host = CookieJar.getHost( url )
		if ( !this.#storage[ host ] ) this.#storage[ host ] = new Map()
		this.#storage[ host ]?.set( toughcookie.key, toughcookie )

		this.save()
	}

	private allowCookie( cookie: tough.Cookie ): boolean {
		if ( !this.#store?.regex ) return true
		const regexes = Array.isArray( this.#store.regex ) ? this.#store.regex : [ this.#store.regex ]
		const match = regexes.find( regex => cookie.key.match( regex ) )
		return match !== undefined
	}

	private static getHost( url: URL ): string {
		const { host, pathname } = url
		const lang = pathname.match( /\/([a-z-]+)\// )?.[ 1 ]

		if ( lang ) {
			return `${ host }/${ lang }`
		}
		return host
	}

	private save(): void {
		if ( !this.#store ) return

		fs.ensureFileSync( this.#store.path )
		const jsonCookies: ICookieStorageJSON = {}
		for ( const host in this.#storage ) {
			jsonCookies[ host ] = []
			const cookies = this.#storage[ host ]
			if ( !cookies ) continue
			for ( const cookie of cookies.values() ) {
				jsonCookies[ host ]?.push( cookie.toJSON() )
			}
		}

		fs.writeJSONSync( this.#store.path, jsonCookies, {
			spaces: this.#prettify ? '\t' : undefined
		} )
	}
}
