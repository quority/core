import {
	RequestManager
} from '../utils'
import {
	Wiki
} from './Wiki'

export class Fandom {
	readonly request: RequestManager

	constructor() {
		this.request = new RequestManager()
	}

	getWiki( interwiki: string ): Wiki {
		return new Wiki( {
			interwiki,
			request: this.request
		} )
	}
}
