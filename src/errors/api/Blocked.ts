import {
	BaseApiError
} from './_BaseApiError'

export class BlockedError extends BaseApiError {
	constructor() {
		super( 'You have been blocked from editing.' )
	}
}
