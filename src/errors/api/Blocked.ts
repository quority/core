import {
	ApiError
} from './_ApiError'

export class BlockedError extends ApiError {
	constructor() {
		super( 'You have been blocked from editing.' )
	}
}
