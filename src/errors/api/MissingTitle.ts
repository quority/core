import { ApiError } from './ApiError'

export class MissingTitleError extends ApiError {
	public static override readonly code = 'missingtitle'

	public constructor( title: string ) {
		super( `The page you specified doesn't exist: "${ title }".` )
	}
}
