import {
	ApiError
} from './_ApiError'

export class NoAPIWriteError extends ApiError {
	constructor() {
		super( 'Editing of this wiki through API is disabled.' )
	}
}
