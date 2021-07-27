import {
	ApiError
} from './_ApiError'

export class AssertBotFailedError extends ApiError {
	constructor() {
		super( '"assert=bot" has been used, but logged in user is not a bot.' )
	}
}
