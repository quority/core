import {
	ApiError
} from './_ApiError'

export class NoSuchRevIDError extends ApiError {
	constructor( id: number ) {
		super( `There is no revision with ID ${ id }.` )
	}
}
