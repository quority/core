import {
	ApiError
} from './ApiError'

export class ArticleExistsError extends ApiError {
	constructor() {
		super( 'The destination article already exists and is not a redirect to the source article.' )
	}
}
