import {
	ApiError
} from './ApiError'

/**
 * Error when you attempt to create a page that is protecte from creation.
 */
export class ProtectedTitleError extends ApiError {
	public static override readonly code = 'protectedtitle'

	public constructor() {
		super( 'The destination article has been protected from creation.' )
	}
}
