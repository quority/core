import {
	ApiError
} from './_ApiError'

export class MissingTitleError extends ApiError {
	constructor( title: string ) {
		super( `The page you requested doesn't exist: ${ title }` )
	}
}
