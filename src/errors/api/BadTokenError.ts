import {
	ApiError
} from './ApiError'

export class BadTokenError extends ApiError {
	static override readonly code = 'badtoken'

	constructor( ) {
		super( 'Invalid CSRF token.' )
	}
}
