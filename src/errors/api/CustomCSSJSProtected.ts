import {
	ApiError
} from './_ApiError'

export class CustomCSSJSProtectedError extends ApiError {
	constructor() {
		super( 'You\'re not allowed to edit custom CSS and JavaScript pages.' )
	}
}
