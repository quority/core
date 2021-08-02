import {
	ApiError
} from './ApiError'

export class BadTokenError extends ApiError {
	constructor( ) {
		super( 'Invalid CSRF token.' )
	}
}
