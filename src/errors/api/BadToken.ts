import {
	BaseApiError
} from './_BaseApiError'

export class BadTokenError extends BaseApiError {
	constructor() {
		super( 'Invalid token.' )
	}
}
