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

	constructor( {
		password, username, wiki
	}: { password: string, username: string, wiki: Wiki } ) {
		this.#password = password
		this.#username = username
		this.#wiki = wiki
	}

	async edit( params: IApiEditRequest ): Promise<IEditResponse> {
		const token = await this.#wiki.getToken( 'csrf' )
		return this.#wiki.post<IEditResponse>( {
			...params,
			action: 'edit',
			assert: 'user',
			token: token.query.tokens.csrftoken
		} )
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
