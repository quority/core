import {
	ApiError
} from './ApiError'

export class SelfMoveError extends ApiError {
	constructor() {
		super( 'Can\'t move a page to itself.' )
	}
}
