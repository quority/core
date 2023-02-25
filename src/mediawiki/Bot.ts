import { MediaWikiError } from '../errors'
import type { BaseStrategy } from '../strategies'
import type { BlockRequest, BlockResponse, DeleteRequest, DeleteResponse, EditRequest, EditResponse, LoginRequest, LoginResponse, MoveRequest, MoveResponse, NoActionToken, ProtectRequest, ProtectResponse, RollbackRequest, RollbackResponse, UnblockRequest, UnblockResponse, UndeleteRequest, UndeleteResponse, UploadRequest, UploadResponse } from '../types'
import type { Wiki } from './Wiki'

export interface BotOptions<S extends BaseStrategy> {
	password: string
	username: string
	wiki: Wiki<S>
}

export class Bot<S extends BaseStrategy> {
	#csrf: string | null = null
	readonly #password: string
	public readonly username: string
	public readonly wiki: Wiki<S>

	public constructor( options: BotOptions<S> ) {
		this.username = options.username
		this.#password = options.password
		this.wiki = options.wiki
	}

	protected get csrf(): string | null {
		return this.#csrf
	}

	protected set csrf( token: string | null ) {
		this.#csrf = token
	}

	public async block( params: NoActionToken<BlockRequest> ): Promise<BlockResponse> {
		return this.wiki.post( {
			...params,
			action: 'block',
			token: await this.getCSRFToken()
		} ) as Promise<BlockResponse>
	}

	public async delete( params: NoActionToken<DeleteRequest> ): Promise<DeleteResponse> {
		return this.wiki.post( {
			...params,
			action: 'delete',
			token: await this.getCSRFToken()
		} ) as Promise<DeleteResponse>
	}

	public async edit( params: NoActionToken<EditRequest> ): Promise<EditResponse> {
		return this.wiki.post( {
			...params,
			action: 'edit',
			assert: params.bot ? 'bot' : 'user',
			token: await this.getCSRFToken()
		} ) as Promise<EditResponse>
	}

	public async getCSRFToken( force = false ): Promise<string> {
		if ( force || !this.csrf ) {
			const token = await this.wiki.getToken( 'csrf' )
			this.csrf = token.query.tokens.csrftoken
		}
		return this.csrf
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
		this.wiki.request.clear( this.wiki.api )

		const tokenreq = await this.wiki.getToken( 'login' )
		const lgtoken = tokenreq.query.tokens.logintoken

		const res = await this.wiki.post( {
			action: 'login',
			lgname: this.username,
			lgpassword: this.#password,
			lgtoken
		} satisfies LoginRequest ) as LoginResponse

		if ( res.login.result !== 'Success' ) {
			throw new MediaWikiError( res.login )
		}
	}

	public async logout(): Promise<void> {
		await this.wiki.post( {
			action: 'logout',
			token: await this.getCSRFToken()
		} )
		this.wiki.request.clear( this.wiki.api )
	}

	public async move( params: NoActionToken<MoveRequest> ): Promise<MoveResponse> {
		return this.wiki.post( {
			...params,
			action: 'move',
			token: await this.getCSRFToken()
		} ) as Promise<MoveResponse>
	}

	public async protect( params: NoActionToken<ProtectRequest> ): Promise<ProtectResponse> {
		return this.wiki.post( {
			...params,
			action: 'protect',
			token: await this.getCSRFToken()
		} ) as Promise<ProtectResponse>
	}

	public purge( titles: string[] ): Promise<void> {
		return this.wiki.purge( titles )
	}

	public async rollback( params: NoActionToken<RollbackRequest> ): Promise<RollbackResponse> {
		return this.wiki.post( {
			...params,
			action: 'rollback',
			token: ( await this.wiki.getToken( 'rollback' ) ).query.tokens.rollbacktoken
		} ) as Promise<RollbackResponse>
	}

	public touch( titles: string[] ): Promise<void> {
		return this.wiki.purge( titles )
	}

	public async unblock( params: NoActionToken<UnblockRequest> ): Promise<UnblockResponse> {
		return this.wiki.post( {
			...params,
			action: 'unblock',
			token: await this.getCSRFToken()
		} ) as Promise<UnblockResponse>
	}

	public async undelete( params: NoActionToken<UndeleteRequest> ): Promise<UndeleteResponse> {
		return this.wiki.post( {
			...params,
			action: 'undelete',
			token: await this.getCSRFToken()
		} ) as Promise<UndeleteResponse>
	}

	public async upload( params: UploadRequest ): Promise<UploadResponse> {
		return this.wiki.post( {
			...params,
			action: 'upload',
			token: await this.getCSRFToken()
		} ) as Promise<UploadResponse>
	}

	public whoAmI(): Promise<{ query: { userinfo: { id: number, name: string } } }> {
		return this.wiki.get( {
			action: 'query',
			meta: 'userinfo',
			uiprop: 'groups'
		} ) as Promise<{ query: { userinfo: { id: number, name: string } } }>
	}
}
