import {
	ApiError
} from './_ApiError'

export class ProtectedPageError extends ApiError {
	constructor( right: string ) {
		super( `The "${ right }" right is required to edit this page.` )
	}
}
