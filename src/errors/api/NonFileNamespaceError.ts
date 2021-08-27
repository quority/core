import {
	ApiError
} from './ApiError'

export class NonFileNamespaceError extends ApiError {
	constructor() {
		super( 'Cannot move file to non-file namespace.' )
	}
}
