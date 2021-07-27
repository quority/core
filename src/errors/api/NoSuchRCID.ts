import {
	ApiError
} from './_ApiError'

export class NoSuchRCIDError extends ApiError {
	constructor( id: number ) {
		super( `There is no change with rcid ${ id }.` )
	}
}
