import {
	ApiError
} from './ApiError'

export class MissingTitleError extends ApiError {
	static readonly code = 'missingtitle'

	constructor( title: string ) {
		super( `The page you specified doesn't exist: "${ title }".` )
	}
}
