import {
	ApiError
} from './ApiError'

export class ImmobileNamespaceError extends ApiError {
	public static override readonly code = 'immobilenamespace'

	public constructor() {
		super( 'You tried to move pages from or to a namespace that is protected from moving.' )
	}
}
