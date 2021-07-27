import {
	BaseApiError
} from './_BaseApiError'

export class InvalidTitleError extends BaseApiError {
	constructor( title: string ) {
		super( `Invalid title: ${ title }` )
	}
}
