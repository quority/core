import {
	BaseApiError
} from './_BaseApiError'

export class AssertBotFailedError extends BaseApiError {
	constructor() {
		super( '"assert=bot" has been used, but logged in user is not a bot.' )
	}
}
