import {
	ApiError
} from './ApiError'

export class ProtectedPageError extends ApiError {
	public static override readonly code = 'protectedpage'

	public constructor() {
		super( 'You don\'t have permission to perform this action on this page.' )
	}
}
