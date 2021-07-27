import {
	ApiError
} from './_ApiError'

export class CascadeProtectedError extends ApiError {
	constructor() {
		super( 'The page you\'re trying to edit is protected because it\'s included in a cascade-protected page.' )
	}
}
