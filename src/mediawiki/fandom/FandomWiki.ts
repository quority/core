import {
	Logger, RequestManager
} from '../../utils'
import {
	BaseWiki
} from '../_base'
import {
	Fandom
} from './Fandom'

export class FandomWiki extends BaseWiki {
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
