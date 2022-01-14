import {
	ApiError
} from './ApiError'

export class BadTokenError extends ApiError {
	public static override readonly code = 'badtoken'

	public constructor( ) {
		super( 'Invalid CSRF token.' )
	}
}
