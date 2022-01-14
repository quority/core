import {
	ApiError
} from './ApiError'

export class PermissionDeniedError extends ApiError {
	public static override readonly code = 'permissiondenied'

	public constructor() {
		super( 'The action you have requested is limited and you don\'t have enough rights.' )
	}
}
