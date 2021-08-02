import {
	ApiError
} from './ApiError'

export class UnknownError extends ApiError {
	constructor( code: string, info: string ) {
		super( `An unknown error occurred with code "${ code }": ${ info }` )
	}
}
