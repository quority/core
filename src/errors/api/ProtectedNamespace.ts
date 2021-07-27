import {
	BaseApiError
} from './_BaseApiError'

export class ProtectedNamespaceError extends BaseApiError {
	constructor( namespace: string ) {
		super( `You're not allowed to edit pages in the "${ namespace }" namespace.` )
	}
}
