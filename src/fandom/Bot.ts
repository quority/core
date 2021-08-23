import {
	BadTokenError,
	LoginFailedError,
	MissingTitleError,
	PermissionDeniedError,
	UnknownError
} from '../errors'
import {
	MWRequests,
	MWResponses
} from '../types'
import {
	Logger
} from '../utils'
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
			await this.login()
			this.#_wikis.add( wiki.interwiki )
		}
	}

	async delete( {
		title, reason = ''
	}: { title: string, reason?: string } ): Promise<MWResponses.Delete> {
		const token = await this.getCSRFToken()

		const req = await this.#wiki.post<MWResponses.Delete | MWResponses.ApiError>( {
			action: 'delete',
			reason,
			title,
			token
		} )

		if ( 'error' in req ) {
			if ( req.error.code === 'badtoken' ) {
				throw new BadTokenError()
			} else if ( req.error.code === 'missingtitle' ) {
				throw new MissingTitleError( title )
			} else if ( req.error.code === 'permissiondenied' ) {
				throw new PermissionDeniedError()
			}

			throw new UnknownError( req.error.code, req.error.info )
		}

		return req
	}

	async edit( params: MWRequests.Edit ): Promise<MWResponses.Edit> {
		const token = await this.getCSRFToken()

		const req = await this.#wiki.post<MWResponses.Edit | MWResponses.ApiError>( {
			...params,
			action: 'edit',
			assert: params.bot ? 'bot' : 'user',
			token
		} )

		if ( 'error' in req ) {
			throw new UnknownError( req.error.code, req.error.info )
		}

		return req
	}

	async getCSRFToken( force = false ): Promise<string> {
		if ( force || !this.#csrf ) {
			const token = await this.#wiki.getToken( 'csrf' )
			this.#csrf = token.query.tokens.csrftoken
		}
		return this.#csrf as string
	}

	async login(): Promise<MWResponses.Login> {
		Logger.account( `Logging in into account "${ this.#username }" for "${ this.#wiki.interwiki }".` )

		const tokenreq = await this.#wiki.getToken( 'login' )
		const lgtoken = tokenreq.query.tokens.logintoken

		const res = await this.#wiki.post<MWResponses.Login>( {
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

	async upload( {
		file, filename
	}: Pick<MWRequests.Upload, 'file' | 'filename'> ): Promise<MWResponses.Upload> {
		const token = await this.getCSRFToken()
		const params = {
			action: 'upload',
			file,
			filename,
			ignorewarnings: 1,
			token
		}

		const req = await this.#wiki.post<MWResponses.Upload | MWResponses.ApiError>( params )

		if ( 'error' in req ) {
			throw new UnknownError( req.error.code, req.error.info )
		}

		return req
	}

	async uploadByUrl( {
		filename, ignorewarnings = 1, url
	}: { filename: string, ignorewarnings?: 0 | 1, url: string } ): Promise<MWResponses.Upload> {
		const token = await this.getCSRFToken()
		const params = {
			action: 'upload',
			filename,
			ignorewarnings,
			token,
			url
		}

		const req = await this.#wiki.post<MWResponses.Upload | MWResponses.ApiError>( params )

		if ( 'error' in req ) {
			throw new UnknownError( req.error.code, req.error.info )
		}

		return req
	}

	/**
	 * @param { Object } params.filename - Name to use for the uploaded file.
	 * @param { Object } params.url - URL of the file to upload.
	 * @description Upload an image by an URL. \
	 * Not to be confused with the `uploadByUrl` method, which uses MediaWiki's extension. \
	 * It will store the image locally in order to upload it.
	 */
	async uploadFromUrl( {
		filename, url
	}: { filename: string, url: string } ): Promise<MWResponses.Upload | undefined> {
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
