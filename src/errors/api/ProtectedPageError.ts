import {
	ApiError
} from './ApiError'

export class ProtectedPageError extends ApiError {
	static override readonly code = 'protectedpage'

	constructor() {
		super( 'You don\'t have permission to perform this action on this page.' )
	}
}
