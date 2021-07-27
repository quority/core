import {
	ApiError
} from './_ApiError'

export class AutoBlockedError extends ApiError {
	constructor() {
		super( 'Your IP address has been blocked automatically, because it was used by a blocked user.' )
	}
}
