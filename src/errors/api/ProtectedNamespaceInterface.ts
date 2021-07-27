import {
	ApiError
} from './_ApiError'

export class ProtectedNamespaceInterfaceError extends ApiError {
	constructor() {
		super( 'You\'re not allowed to edit interface messages.' )
	}
}
