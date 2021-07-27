import {
	BaseApiError
} from './_BaseApiError'

export class MissingTitleError extends BaseApiError {
	constructor( title: string ) {
		super( `The page you requested doesn't exist: ${ title }` )
	}
}
