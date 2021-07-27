import {
	BaseApiError
} from './_BaseApiError'

export class ProtectedPageError extends BaseApiError {
	constructor( right: string ) {
		super( `The "${ right }" right is required to edit this page.` )
	}
}
