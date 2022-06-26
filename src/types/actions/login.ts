import type { ActionRequest } from '../Request'

export interface LoginRequest extends ActionRequest {
	action: 'login'

	/**
	 * User name.
	 */
	lgname: string

	/**
	 * Password.
	 */
	lgpassword: string

	/**
	 * A "login" token.
	 */
	lgtoken: string
}

export interface LoginResponse extends Response {
	login: {
		lguserid: number
		lgusername: string
		result: 'Success'
	} | {
		reason: string
		result: 'Failed'
	}
}
