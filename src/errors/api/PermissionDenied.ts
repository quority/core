import {
	ApiError
} from './ApiError'

export class PermissionDeniedError extends ApiError {
	static readonly code = 'permissiondenied'

	constructor() {
		super( 'The action you have requested is limited and you don\'t have enough rights.' )
	}
}
