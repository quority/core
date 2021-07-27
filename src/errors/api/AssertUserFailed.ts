import {
	BaseApiError
} from './_BaseApiError'

export class AssertUserFailedError extends BaseApiError {
	constructor() {
		super( '"assert=user" has been used, but user is not logged in.' )
	}
}
