import {
	Bot
} from './Bot'
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

	async login( {
		password, username, wiki
	}: { password: string, username: string, wiki?: Wiki } ): Promise<Bot> {
		const bot = new Bot( {
			password,
			username,
			wiki: wiki ?? this.getWiki( 'community' )
		} )

		await bot.login()

		return bot
	}
}
