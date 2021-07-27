import {
	ApiError
} from './_ApiError'

export class InvalidUserError extends ApiError {
	constructor( username: string ) {
		super( `Invalid username: ${ username }` )
	}
}
