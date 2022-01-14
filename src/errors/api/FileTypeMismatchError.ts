import { ApiError } from './ApiError'

export class FileTypeMismatchError extends ApiError {
	public static override readonly code = 'filetypemismatch'

	public constructor() {
		super( 'The new file extension does not match its type.' )
	}
}
