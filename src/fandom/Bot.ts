import {
	Logger
} from '../utils'
import {
	Wiki
} from './Wiki'

export class Bot {
	readonly #password: string
	readonly #username: string
	readonly #wiki: Wiki

	#csrf?: string

	constructor( {
		password, username, wiki
	}: { password: string, username: string, wiki: Wiki } ) {
		this.#password = password
		this.#username = username
		this.#wiki = wiki
	}

	async delete( {
		title, reason = ''
	}: { title: string, reason?: string } ): Promise<boolean> {
		const token = await this.getCSRFToken()

		const req = await this.#wiki.post<{ delete: { logid: number } }>( {
			action: 'delete',
			reason,
			title,
			token
		} )
			.then( () => true )
			.catch( async ( e: ApiError ) => {
				if ( e.code === 'badtoken' || e.code === 'notoken' ) {
					Logger.warn( 'There was an error with the action. Regenerating CSRF and trying again...' )
					await this.getCSRFToken( true )
					return this.delete( {
						reason, title
					} )
				}

				throw e
			} )

		return req
	}

	async edit( params: IApiEditRequest ): Promise<IEditResponse> {
		const token = await this.getCSRFToken()
		return this.#wiki.post<IEditResponse>( {
			...params,
			action: 'edit',
			assert: 'user',
			token
		} )
			.catch( async ( e: ApiError ) => {
				if ( e.code === 'notoken' || e.code === 'badtoken' ) {
					Logger.warn( 'There was an error with the action. Regenerating CSRF and trying again...' )
					await this.getCSRFToken( true )
					return this.edit( params )
				}

				throw e
			} )
	}

	async getCSRFToken( force = false ): Promise<string> {
		if ( force || !this.#csrf ) {
			const token = await this.#wiki.getToken( 'csrf' )
			this.#csrf = token.query.tokens.csrftoken
		}
		return this.#csrf as string
	}

	async login(): Promise<ILoginResponse> {
		Logger.account( `Logging in into account "${ this.#username }".` )

		const tokenreq = await this.#wiki.getToken( 'login' )
		const lgtoken = tokenreq.query.tokens.logintoken

		return this.#wiki.post<ILoginResponse>( {
			action: 'login',
			lgname: this.#username,
			lgpassword: this.#password,
			lgtoken
		} )
	}

	whoAmI(): Promise<{ query: { userinfo: { id: number, name: string } } }> {
		return this.#wiki.get<{ query: { userinfo: { id: number, name: string } } }>( {
			action: 'query',
			meta: 'userinfo',
			uiprop: 'groups'
		} )
	}
}
