import {
	BaseApiError
} from './_BaseApiError'

export class ReadAPIDeniedError extends BaseApiError {
	constructor() {
		super( 'You need read permission to use this module.' )
	}
}
