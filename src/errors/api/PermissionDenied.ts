import {
	ApiError
} from './ApiError'

export class PermissionDeniedError extends ApiError {
	constructor() {
		super( 'The action you have requested is limited and you don\'t have enough rights.' )
	}
}
