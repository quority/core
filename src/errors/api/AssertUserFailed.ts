import {
	ApiError
} from './_ApiError'

export class AssertUserFailedError extends ApiError {
	constructor() {
		super( '"assert=user" has been used, but user is not logged in.' )
	}
}
