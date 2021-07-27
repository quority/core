import {
	BaseApiError
} from './_BaseApiError'

export class ConfirmEmailError extends BaseApiError {
	constructor() {
		super( 'You must confirm your e-mail address before you can edit.' )
	}
}
