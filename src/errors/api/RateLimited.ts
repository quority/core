import {
	BaseApiError
} from './_BaseApiError'

export class RateLimitedError extends BaseApiError {
	constructor() {
		super( 'You\'ve exceeded your rate limit. Please, wait some time and try again.' )
	}
}
