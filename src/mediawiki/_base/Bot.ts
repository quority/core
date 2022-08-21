import type { APIError, BlockRequest, BlockResponse, DeleteRequest, DeleteResponse, EditRequest, EditResponse, LoginRequest, LoginResponse, MoveRequest, MoveResponse, NoActionToken, ProtectRequest, ProtectResponse, RollbackRequest, RollbackResponse, UploadRequest, UploadResponse } from '../../types'
import { MediaWikiError } from '../../errors'
import type { Wiki } from './Wiki'

export class Bot<WikiType extends Wiki = Wiki> {
	readonly #password: string
	readonly #username: string
	#wiki: WikiType

	#csrf?: string

	public constructor( { password, username, wiki }: { password: string, username: string, wiki: WikiType } ) {
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

	public async block( params: NoActionToken<BlockRequest> ): Promise<BlockResponse> {
		return this.wiki.post<BlockResponse>( {
			...params,
			action: 'block',
			token: await this.getCSRFToken()
		} )
	}

	public async delete( params: NoActionToken<DeleteRequest> ): Promise<DeleteResponse> {
		const req = await this.#wiki.post<DeleteResponse | APIError>( {
			...params,
			action: 'delete',
			token: await this.getCSRFToken()
		} )

		if ( 'error' in req ) {
			throw new MediaWikiError( req.error )
		}

		return req
	}

	public async edit( params: NoActionToken<EditRequest> ): Promise<EditResponse> {
		const req = await this.#wiki.post<EditResponse | APIError>( {
			...params,
			action: 'edit',
			assert: params.bot ? 'bot' : 'user',
			token: await this.getCSRFToken()
		} )

		if ( 'error' in req ) {
			throw new MediaWikiError( req.error )
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

		const tokenreq = await this.#wiki.getToken( 'login' )
		const lgtoken = tokenreq.query.tokens.logintoken

		const res = await this.#wiki.post<LoginResponse, LoginRequest>( {
			action: 'login',
			lgname: this.#username,
			lgpassword: this.#password,
			lgtoken
		} )

		if ( res.login.result !== 'Success' ) {
			throw new MediaWikiError( res.login )
		}
	}

	public async logout(): Promise<void> {
		await this.#wiki.post( {
			action: 'logout',
			token: await this.getCSRFToken()
		} )
		this.#wiki.request.clear( this.#wiki.api )
	}

	public async move( params: MoveRequest ): Promise<MoveResponse> {
		const req = await this.#wiki.post<MoveResponse | APIError>( {
			...params,
			action: 'move',
			token: await this.getCSRFToken()
		} )

		if ( 'error' in req ) {
			throw new MediaWikiError( req.error )
		}

		return req
	}

	public async protect( params: ProtectRequest ): Promise<ProtectResponse> {
		return this.wiki.post( {
			...params,
			action: 'protect',
			token: await this.getCSRFToken()
		} )
	}

	public purge( titles: string[] ): Promise<Record<string, boolean>> {
		return this.wiki.purge( titles )
	}

	public async rollback( params: NoActionToken<RollbackRequest> ): Promise<RollbackResponse> {
		const req = await this.wiki.post<APIError | RollbackResponse>( {
			...params,
			action: 'rollback',
			token: ( await this.wiki.getToken( 'rollback' ) ).query.tokens.rollbacktoken
		} )

		if ( 'error' in req ) {
			throw new MediaWikiError( req.error )
		}

		return req
	}

	public touch( titles: string[] ): Promise<Record<string, boolean>> {
		return this.wiki.purge( titles )
	}

	public async unblock( params: BlockRequest ): Promise<BlockResponse> {
		return this.wiki.post( {
			...params,
			action: 'unblock',
			token: await this.getCSRFToken()
		} )
	}

	public async upload( params: UploadRequest ): Promise<UploadResponse> {
		const req = await this.#wiki.post<UploadResponse | APIError>( {
			...params,
			action: 'upload',
			token: await this.getCSRFToken()
		} )

		if ( 'error' in req ) {
			throw new MediaWikiError( req.error )
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
	/*
	public async uploadFromUrl( {
		filename, url
	}: { filename: string, url: string } ): Promise<UploadResponse | undefined> {
		const image = await fetch( url )
		if ( !image.ok ) return undefined

		const tmpfile = await tmp.file()
		const filepath = tmpfile.path
		const buffer = await image.buffer()
		fs.writeFileSync(
			filepath,
			buffer
		)

		const file = fs.createReadStream( filepath )
		const res = await this.upload( {
			file,
			filename
		} )
		await tmpfile.cleanup()

		return res
	}
	*/

	public whoAmI(): Promise<{ query: { userinfo: { id: number, name: string } } }> {
		return this.#wiki.get<{ query: { userinfo: { id: number, name: string } } }>( {
			action: 'query',
			meta: 'userinfo',
			uiprop: 'groups'
		} )
	}
}
