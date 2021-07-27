import {
	ApiError
} from './_ApiError'

export class ProtectedNamespaceError extends ApiError {
	constructor( namespace: string ) {
		super( `You're not allowed to edit pages in the "${ namespace }" namespace.` )
	}
}
