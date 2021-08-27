import {
	ApiError
} from './ApiError'

export class FileExistsNoChangeError extends ApiError {
	static readonly code = 'fileexists-no-change'

	constructor() {
		super( 'The upload is an exact duplicate of its current version.' )
	}
}
