import {
	BaseApiError
} from './_BaseApiError'

export class MustBePostedError extends BaseApiError {
	constructor() {
		super( 'Type of your HTTP request message must be POST.' )
	}
}
