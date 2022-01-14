import { ApiError } from './ApiError'

export class NonFileNamespaceError extends ApiError {
	public static override readonly code = 'nonfilenamespace'

	public constructor() {
		super( 'Cannot move file to non-file namespace.' )
	}
}
