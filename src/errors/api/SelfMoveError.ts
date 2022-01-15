import { ApiError } from './ApiError'

export class SelfMoveError extends ApiError {
	public static override readonly code = 'selfmove'

	public constructor() {
		super( 'Can\'t move a page to itself.' )
	}
}
