import {
	BaseApiError
} from './_BaseApiError'

export class HookAbortedError extends BaseApiError {
	constructor() {
		super( 'The modification you tried to make was aborted by an extension hook.' )
	}
}
