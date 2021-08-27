import {
	ApiError
} from './ApiError'

export class FileTypeMismatchError extends ApiError {
	constructor() {
		super( 'The new file extension does not match its type.' )
	}
}
