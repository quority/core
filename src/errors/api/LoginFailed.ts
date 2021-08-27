import {
	ApiError
} from './ApiError'

export class LoginFailedError extends ApiError {
	static readonly code = 'Failed'

	constructor( username: string ) {
		super( `Couldn't authenticate using the provided credentials for "${ username }".` )
	}
}
