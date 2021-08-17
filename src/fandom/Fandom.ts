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

	async getUserAvatar( username: string ): Promise<string | undefined> {
		const userId = await this.getUserId( username )
		if ( !userId ) return

		const req = await this.request.raw( `https://services.fandom.com/user-attribute/user/${ userId }/attr/avatar` )
		const res: { value?: string } = await req.json()

		return res.value
	}

	async getUserDiscordTag( username: string ): Promise<string | undefined> {
		const userId = await this.getUserId( username )
		if ( !userId ) return

		const req = await this.request.raw( `https://services.fandom.com/user-attribute/user/${ userId }/attr/discordHandle` )
		const res: { value?: string } = await req.json()

		return res.value
	}

	async getUserId( username: string ): Promise<number | undefined> {
		const wiki = this.getWiki( 'community' )
		const query = await wiki.query( {
			list: 'users',
			ususers: username
		} )
		return query[0].userid
	}

	async getUsersIds( usernames: string[] ): Promise<Record<string, number | undefined>> {
		const wiki = this.getWiki( 'community' )
		const query = await wiki.query( {
			list: 'users',
			ususers: usernames
		} )
		return query.reduce( ( result, user ) => {
			result[ user.name ] = user.userid
			return result
		}, {
		} as Record<string, number> )
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
