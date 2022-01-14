import type {
	MediaWikiRequest,
	MediaWikiResponse,
	ReducedRequest
} from '../../types'
import {
	ErrorManager
} from '../../errors'
import fetch from 'node-fetch'
import fs from 'fs-extra'
import {
	Logger
} from '../../utils'
import path from 'path'
import type {
	Wiki
} from './Wiki'

export class Bot<WikiType extends Wiki = Wiki> {
	readonly #password: string
	readonly #username: string
	#wiki: WikiType

	#csrf?: string

	public constructor( {
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

	public async block( params: ReducedRequest<MediaWikiRequest.Block> ): Promise<MediaWikiResponse.Block> {
		const token = await this.getCSRFToken()
		return this.wiki.post<MediaWikiResponse.Block, MediaWikiRequest.Block>( {
			...params,
			action: 'block',
			token
		} )
	}

	public async delete( params: ReducedRequest<MediaWikiRequest.Delete> ): Promise<MediaWikiResponse.Delete> {
		const token = await this.getCSRFToken()

		const req = await this.#wiki.post<MediaWikiResponse.Delete | MediaWikiResponse.ApiError>( {
			...params,
			action: 'delete',
			token
		} )

		if ( 'error' in req ) {
			const error = ErrorManager.getError( req.error.code, req.error.info )
			throw error
		}

		return req
	}

	public async edit( params: ReducedRequest<MediaWikiRequest.Edit> ): Promise<MediaWikiResponse.Edit> {
		const token = await this.getCSRFToken()

		const req = await this.#wiki.post<MediaWikiResponse.Edit | MediaWikiResponse.ApiError>( {
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

	public async getCSRFToken( force = false ): Promise<string> {
		if ( force || !this.#csrf ) {
			const token = await this.#wiki.getToken( 'csrf' )
			this.#csrf = token.query.tokens.csrftoken
		}
		return this.#csrf
	}

	public async isLoggedIn(): Promise<boolean> {
		const whoami = await this.whoAmI()
		return whoami.query.userinfo.id !== 0
	}

	public async login( force = false ): Promise<void> {
		if ( !force ) {
			const isLoggedIn = await this.isLoggedIn()
			if ( isLoggedIn ) return
		}
		this.#wiki.request.clear( this.#wiki.api )
		Logger.account( `Logging in into account "${ this.#username }" for "${ this.#wiki.api }".` )

		const tokenreq = await this.#wiki.getToken( 'login' )
		const lgtoken = tokenreq.query.tokens.logintoken

		const res = await this.#wiki.post<MediaWikiResponse.Login, MediaWikiRequest.Login>( {
			action: 'login',
			lgname: this.#username,
			lgpassword: this.#password,
			lgtoken
		} )

		if ( res.login.result !== 'Success' ) {
			const error = ErrorManager.getError( 'Failed', this.#username )
			throw error
		}
	}

	public async logout(): Promise<void> {
		await this.#wiki.post( {
			action: 'logout',
			token: await this.getCSRFToken()
		} )
		this.#wiki.request.clear( this.#wiki.api )
	}

	public async move( params: ReducedRequest<MediaWikiRequest.Move> ): Promise<MediaWikiResponse.Move> {
		const token = await this.getCSRFToken()
		const req = await this.#wiki.post<MediaWikiResponse.Move | MediaWikiResponse.ApiError>( {
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

	public async protect( params: ReducedRequest<MediaWikiRequest.Protect> ): Promise<MediaWikiResponse.Protect> {
		const token = await this.getCSRFToken()

		return this.wiki.post( {
			...params,
			action: 'protect',
			token
		} )
	}

	public purge( titles: string[] ): Promise<Record<string, boolean>> {
		return this.wiki.purge( titles )
	}

	public touch( titles: string[] ): Promise<Record<string, boolean>> {
		return this.wiki.purge( titles )
	}

	public async unblock( params: ReducedRequest<MediaWikiRequest.Block> ): Promise<MediaWikiResponse.Block> {
		const token = await this.getCSRFToken()
		return this.wiki.post( {
			...params,
			action: 'unblock',
			token
		} )
	}

	public async upload( params: ReducedRequest<MediaWikiRequest.Upload> ): Promise<MediaWikiResponse.Upload> {
		const token = await this.getCSRFToken()

		const req = await this.#wiki.post<MediaWikiResponse.Upload | MediaWikiResponse.ApiError>( {
			...params,
			action: 'upload',
			token
		} )

		if ( 'error' in req ) {
			const error = ErrorManager.getError( req.error.code, req.error.info )
			throw error
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
	public async uploadFromUrl( {
		filename, url
	}: { filename: string, url: string } ): Promise<MediaWikiResponse.Upload | undefined> {
		const image = await fetch( url )
		if ( !image.ok ) return undefined

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

	public whoAmI(): Promise<{ query: { userinfo: { id: number, name: string } } }> {
		return this.#wiki.get<{ query: { userinfo: { id: number, name: string } } }>( {
			action: 'query',
			meta: 'userinfo',
			uiprop: 'groups'
		} )
	}
}
