import {
	BaseApiError
} from './_BaseApiError'

export class CascadeProtectedError extends BaseApiError {
	constructor() {
		super( 'The page you\'re trying to edit is protected because it\'s included in a cascade-protected page.' )
	}
}
