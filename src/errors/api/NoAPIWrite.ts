import {
	BaseApiError
} from './_BaseApiError'

export class NoAPIWriteError extends BaseApiError {
	constructor() {
		super( 'Editing of this wiki through API is disabled.' )
	}
}
