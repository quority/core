import {
	BaseApiError
} from './_BaseApiError'

export class AutoBlockedError extends BaseApiError {
	constructor() {
		super( 'Your IP address has been blocked automatically, because it was used by a blocked user.' )
	}
}
