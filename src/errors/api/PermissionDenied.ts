import {
	ApiError
} from './_ApiError'

export class PermissionDeniedError extends ApiError {
	constructor() {
		super( 'Permission denied.' )
	}
}
