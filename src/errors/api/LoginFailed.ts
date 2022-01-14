import {
	ApiError
} from './ApiError'

export class LoginFailedError extends ApiError {
	public static override readonly code = 'Failed'

	public constructor( username: string ) {
		super( `Couldn't authenticate using the provided credentials for "${ username }".` )
	}
}
