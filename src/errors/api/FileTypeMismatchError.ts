import {
	ApiError
} from './ApiError'

export class FileTypeMismatchError extends ApiError {
	static readonly code = 'filetypemismatch'

	constructor() {
		super( 'The new file extension does not match its type.' )
	}
}
