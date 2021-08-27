import {
	ApiError
} from './ApiError'

export class ImmobileNamespaceError extends ApiError {
	static readonly code = 'immobilenamespace'

	constructor() {
		super( 'You tried to move pages from or to a namespace that is protected from moving.' )
	}
}
