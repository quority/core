import {
	ApiError
} from './_ApiError'

export class ReadonlyError extends ApiError {
	constructor() {
		super( 'The wiki is currently in read-only mode.' )
	}
}
