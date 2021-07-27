import {
	BaseApiError
} from './_BaseApiError'

export class NoSuchUserError extends BaseApiError {
	constructor( user: string ) {
		super( `The user you specified doesn't exist: ${ user }` )
	}
}
