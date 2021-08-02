import {
	ApiError
} from './ApiError'

export class LoginFailedError extends ApiError {
	constructor( username: string ) {
		super( `Couldn't authenticate using the provided credentials for "${ username }".` )
	}
}
