import {
	ApiError
} from './_ApiError'

export class RateLimitedError extends ApiError {
	constructor() {
		super( 'You\'ve exceeded your rate limit. Please, wait some time and try again.' )
	}
}
