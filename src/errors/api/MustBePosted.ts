import {
	ApiError
} from './_ApiError'

export class MustBePostedError extends ApiError {
	constructor() {
		super( 'Type of your HTTP request message must be POST.' )
	}
}
