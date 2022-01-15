import { ApiError } from './ApiError'

export class UnknownError extends ApiError {
	public static override readonly code = 'unknown'

	public constructor( code: string, info: string ) {
		super( `An unknown error occurred with code "${ code }": ${ info }` )
	}
}
