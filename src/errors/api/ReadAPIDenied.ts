import {
	ApiError
} from './_ApiError'

export class ReadAPIDeniedError extends ApiError {
	constructor() {
		super( 'You need read permission to use this module.' )
	}
}
