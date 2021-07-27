import {
	ApiError
} from './_ApiError'

export class BadTokenError extends ApiError {
	constructor() {
		super( 'Invalid token.' )
	}
}
