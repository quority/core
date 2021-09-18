import {
	MWRequests,
	MWResponses
} from '../../types'
import {
	ErrorManager
} from '../../errors'
import {
	Logger
} from '../../utils'
import {
	Wiki
} from './Wiki'
import fetch from 'node-fetch'
import fs from 'fs-extra'
import path from 'path'

export class Bot<WikiType extends Wiki = Wiki> {
	readonly #password: string
	readonly #username: string
	#wiki: WikiType

	#csrf?: string

	constructor( {
		password, username, wiki
	}: { password: string, username: string, wiki: WikiType } ) {
		this.#password = password.trim()
		this.#username = username.trim()
		this.#wiki = wiki
	}

	protected get wiki(): WikiType {
		return this.#wiki
	}
	protected set wiki( wiki: WikiType ) {
		this.#wiki = wiki
	}

	async block( params: MWRequests.Block ): Promise<MWResponses.Block> {
		const token = await this.getCSRFToken()
		return this.wiki.post( {
			...params,
			action: 'block',
			token
		} )
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
			const error = ErrorManager.getError( req.error.code, req.error.info )
			throw error
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
			const error = ErrorManager.getError( req.error.code, req.error.info )
			throw error
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
		this.#wiki.request.clear( this.#wiki.api )
		Logger.account( `Logging in into account "${ this.#username }" for "${ this.#wiki.api }".` )

		const tokenreq = await this.#wiki.getToken( 'login' )
		const lgtoken = tokenreq.query.tokens.logintoken

		const res = await this.#wiki.post<MWResponses.Login>( {
			action: 'login',
			lgname: this.#username,
			lgpassword: this.#password,
			lgtoken
		} )

		if ( res.login.result !== 'Success' ) {
			const error = ErrorManager.getError( 'Failed', this.#username )
			throw error
		}

		return res
	}

	async move( params: MWRequests.Move ): Promise<MWResponses.Move> {
		const token = await this.getCSRFToken()
		const req = await this.#wiki.post<MWResponses.Move | MWResponses.ApiError>( {
			...params,
			action: 'move',
			token
		} )

		if ( 'error' in req ) {
			const error = ErrorManager.getError( req.error.code, req.error.info )
			throw error
		}

		return req
	}

	async protect( params: MWRequests.Protect ): Promise<MWResponses.Protect> {
		const token = await this.getCSRFToken()

		return this.wiki.post( {
			...params,
			action: 'protect',
			token
		} )
	}

	purge( titles: string[] ): Promise<Record<string, boolean>> {
		return this.wiki.purge( titles )
	}

	touch( titles: string[] ): Promise<Record<string, boolean>> {
		return this.wiki.purge( titles )
	}

	async unblock( params: { user: string, reason?: string } ): Promise<MWResponses.Block> {
		const token = await this.getCSRFToken()
		return this.wiki.post( {
			...params,
			action: 'unblock',
			token
		} )
	}

	async upload( {
		file = undefined, filename, url = undefined
	}: { filename: string } & ( { file: fs.ReadStream, url?: undefined } | { file?: undefined, url: string } ) ): Promise<MWResponses.Upload> {
		const token = await this.getCSRFToken()
		const params = {
			action: 'upload',
			file,
			filename,
			ignorewarnings: 1,
			token,
			url
		}

		const req = await this.#wiki.post<MWResponses.Upload | MWResponses.ApiError>( params )

		if ( 'error' in req ) {
			const error = ErrorManager.getError( req.error.code, req.error.info )
			throw error
		}

		return req
	}

	async uploadByUrl( {
		filename, url
	}: { filename: string, url: string } ): Promise<MWResponses.Upload> {
		return this.upload( {
			filename,
			url
		} )
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