import {
	Logger
} from '../utils'
import {
	LoginFailedError
} from '../errors'
import {
	Wiki
} from './Wiki'
import fetch from 'node-fetch'
import fs from 'fs-extra'
import path from 'path'

export class Bot {
	readonly #password: string
	readonly #username: string
	#wiki: Wiki

	#csrf?: string
	#_wikis = new Set<string>()

	constructor( {
		password, username, wiki
	}: { password: string, username: string, wiki: Wiki } ) {
		this.#password = password
		this.#username = username
		this.#wiki = wiki
		this.#_wikis.add( wiki.interwiki )
	}

	get wiki(): Wiki {
		return this.#wiki
	}
	async setWiki( wiki: Wiki ): Promise<void> {
		this.#wiki = wiki

		if ( !this.#_wikis.has( wiki.interwiki ) ) {
			Logger.info( `${ wiki.interwiki } not found in { ${ [ ...this.#_wikis ].join( ', ' ) } }` )
			await this.login()
			this.#_wikis.add( wiki.interwiki )
		}
	}

	async delete( {
		title, reason = ''
	}: { title: string, reason?: string } ): Promise<boolean> {
		const token = await this.getCSRFToken()

		const req = await this.#wiki.post<Partial<{ delete: { logid: number } }>>( {
			action: 'delete',
			reason,
			title,
			token
		} )

		return req.delete?.logid !== undefined
	}

	async edit( params: MWRequest.Edit ): Promise<MWResponse.Edit> {
		const token = await this.getCSRFToken()
		return this.#wiki.post<MWResponse.Edit>( {
			...params,
			action: 'edit',
			assert: 'user',
			token
		} )
	}

	async getCSRFToken( force = false ): Promise<string> {
		if ( force || !this.#csrf ) {
			const token = await this.#wiki.getToken( 'csrf' )
			this.#csrf = token.query.tokens.csrftoken
		}
		return this.#csrf as string
	}

	async login(): Promise<MWResponse.Login> {
		Logger.account( `Logging in into account "${ this.#username }" for "${ this.#wiki.interwiki }".` )

		const tokenreq = await this.#wiki.getToken( 'login' )
		const lgtoken = tokenreq.query.tokens.logintoken

		const res = await this.#wiki.post<MWResponse.Login>( {
			action: 'login',
			lgname: this.#username,
			lgpassword: this.#password,
			lgtoken
		} )

		if ( res.login.result !== 'Success' ) {
			throw new LoginFailedError( this.#username )
		}

		return res
	}

	private async regenerateCSRFToken(): Promise<void> {
		Logger.warn( 'There was an error with the action. Regenerating CSRF and trying again...' )
		await this.getCSRFToken( true )
	}

	async upload( {
		file, filename
	}: Pick<MWRequest.Upload, 'file' | 'filename'> ): Promise<MWResponse.Upload> {
		const token = await this.getCSRFToken()
		const params = {
			action: 'upload',
			file,
			filename,
			ignorewarnings: 1,
			token
		}

		return this.#wiki.post<MWResponse.Upload>( params )
	}

	async uploadByUrl( {
		filename, url
	}: { filename: string, url: string } ): Promise<MWResponse.Upload | undefined> {
		const image = await fetch( url )
		if ( !image.ok ) return

		fs.ensureDirSync( path.resolve( __dirname, './tmp' ) )
		const filepath = path.resolve( __dirname, `./tmp/${ filename }` )
		const buffer = await image.arrayBuffer()
		fs.writeFileSync(
			filepath,
			Buffer.from( buffer )
		)

		const file = fs.createReadStream( filepath )
		const res = await this.upload( {
			file,
			filename
		} )
		fs.removeSync( filepath )

		return res
	}

	whoAmI(): Promise<{ query: { userinfo: { id: number, name: string } } }> {
		return this.#wiki.get<{ query: { userinfo: { id: number, name: string } } }>( {
			action: 'query',
			meta: 'userinfo',
			uiprop: 'groups'
		} )
	}
}
