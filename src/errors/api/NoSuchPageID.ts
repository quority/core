import {
	BaseApiError
} from './_BaseApiError'

export class NoSuchPageIdError extends BaseApiError {
	constructor( id: number ) {
		super( `There is no page with ID ${ id }.` )
	}
}
