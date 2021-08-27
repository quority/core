import {
	ApiError
} from './ApiError'

export class SelfMoveError extends ApiError {
	static readonly code = 'selfmove'

	constructor() {
		super( 'Can\'t move a page to itself.' )
	}
}
