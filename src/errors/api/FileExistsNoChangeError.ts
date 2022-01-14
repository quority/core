import { ApiError } from './ApiError'

export class FileExistsNoChangeError extends ApiError {
	public static override readonly code = 'fileexists-no-change'

	public constructor() {
		super( 'The upload is an exact duplicate of its current version.' )
	}
}
