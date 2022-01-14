import { ApiError } from './ApiError'

export class DisabledExtensionError extends ApiError {
	public static override readonly code = [ 'copyuploaddisabled' ]

	public constructor( extension: string ) {
		super( `The requested action requires extension "${ extension }", but it is not enabled in the target wiki.` )
	}
}
