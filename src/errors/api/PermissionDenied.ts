import {
	BaseApiError
} from './_BaseApiError'

export class PermissionDeniedError extends BaseApiError {
	constructor() {
		super( 'Permission denied.' )
	}
}
