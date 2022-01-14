import { ApiError } from './ApiError'

export class ArticleExistsError extends ApiError {
	public static override readonly code = 'articleexists'

	public constructor() {
		super( 'The destination article already exists and is not a redirect to the source article.' )
	}
}
