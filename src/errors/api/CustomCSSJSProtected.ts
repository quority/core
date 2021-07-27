import {
	BaseApiError
} from './_BaseApiError'

export class CustomCSSJSProtectedError extends BaseApiError {
	constructor() {
		super( 'You\'re not allowed to edit custom CSS and JavaScript pages.' )
	}
}
