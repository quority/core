import {
	BaseApiError
} from './_BaseApiError'

export class UnknownError extends BaseApiError {
	constructor( code: string ) {
		super( `An unknown error has occurred: ${ code }` )
	}
}
