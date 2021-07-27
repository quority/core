import {
	BaseApiError
} from './_BaseApiError'

export class ProtectedNamespaceInterfaceError extends BaseApiError {
	constructor() {
		super( 'You\'re not allowed to edit interface messages.' )
	}
}
