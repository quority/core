import {
	BaseApiError
} from './_BaseApiError'

export class InvalidUserError extends BaseApiError {
	constructor( username: string ) {
		super( `Invalid username: ${ username }` )
	}
}
