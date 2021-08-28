import {
	Logger, RequestManager
} from '../../utils'
import {
	Fandom
} from './Fandom'
import {
	Wiki
} from '../_base'

export class FandomWiki extends Wiki {
	readonly interwiki: string

	constructor( {
		disableLogger, interwiki, request
	}: { disableLogger?: boolean, interwiki: string, request: RequestManager } ) {
		super( {
			api: Fandom.interwiki2api( interwiki ),
			disableLogger,
			request
		} )
		Logger.community( `Initializing wiki "${ interwiki }".` )

		this.interwiki = interwiki
	}
}
