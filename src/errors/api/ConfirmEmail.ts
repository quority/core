import {
	ApiError
} from './_ApiError'

export class ConfirmEmailError extends ApiError {
	constructor() {
		super( 'You must confirm your e-mail address before you can edit.' )
	}
}
