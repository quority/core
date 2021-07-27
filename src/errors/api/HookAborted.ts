import {
	ApiError
} from './_ApiError'

export class HookAbortedError extends ApiError {
	constructor() {
		super( 'The modification you tried to make was aborted by an extension hook.' )
	}
}
