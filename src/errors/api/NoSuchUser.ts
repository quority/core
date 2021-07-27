import {
	ApiError
} from './_ApiError'

export class NoSuchUserError extends ApiError {
	constructor( user: string ) {
		super( `The user you specified doesn't exist: ${ user }` )
	}
}
