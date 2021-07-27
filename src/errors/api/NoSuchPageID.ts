import {
	ApiError
} from './_ApiError'

export class NoSuchPageIdError extends ApiError {
	constructor( id: number ) {
		super( `There is no page with ID ${ id }.` )
	}
}
