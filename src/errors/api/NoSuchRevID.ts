import {
	BaseApiError
} from './_BaseApiError'

export class NoSuchRevIDError extends BaseApiError {
	constructor( id: number ) {
		super( `There is no revision with ID ${ id }.` )
	}
}
