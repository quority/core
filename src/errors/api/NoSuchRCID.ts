import {
	BaseApiError
} from './_BaseApiError'

export class NoSuchRCIDError extends BaseApiError {
	constructor( id: number ) {
		super( `There is no change with rcid ${ id }.` )
	}
}
