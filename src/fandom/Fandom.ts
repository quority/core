import {
	Logger,
	RequestManager
} from '../utils'
import {
	Bot
} from './Bot'
import {
	Wiki
} from './Wiki'

export class Fandom {
	readonly request: RequestManager

	constructor( {
		disableLogger = true
	}: { disableLogger?: boolean } = {
	} ) {
		this.request = new RequestManager()
		if ( disableLogger ) {
			Logger.disable()
		}
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
