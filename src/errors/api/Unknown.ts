import {
	ApiError
} from './_ApiError'

export class UnknownError extends ApiError {
	constructor( code: string ) {
		super( `An unknown error has occurred: ${ code }` )
	}
}
