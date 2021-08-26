import {
	ApiError
} from './ApiError'

export class FileExistsNoChangeError extends ApiError {
	constructor() {
		super( 'The upload is an exact duplicate of its current version.' )
	}
}
