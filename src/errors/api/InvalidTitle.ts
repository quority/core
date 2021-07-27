import {
	ApiError
} from './_ApiError'

export class InvalidTitleError extends ApiError {
	constructor( title: string ) {
		super( `Invalid title: ${ title }` )
	}
}
