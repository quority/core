import {
	BaseApiError
} from './_BaseApiError'

export class ReadonlyError extends BaseApiError {
	constructor() {
		super( 'The wiki is currently in read-only mode.' )
	}
}
