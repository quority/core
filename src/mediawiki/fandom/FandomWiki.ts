import {
	Logger, RequestManager
} from '../../utils'
import {
	Wiki
} from '../_base'
import {
	Fandom
} from './Fandom'

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
