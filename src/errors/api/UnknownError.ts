import {
	ApiError
} from './ApiError'

export class UnknownError extends ApiError {
	static override readonly code = 'unknown'

	constructor( code: string, info: string ) {
		super( `An unknown error occurred with code "${ code }": ${ info }` )
	}
}
