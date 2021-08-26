import {
	Logger,
	RequestManager
} from '../../utils'
import {
	InvalidInterwikiError
} from '../../errors'
import {
	FandomBot
} from './FandomBot'
import {
	FandomWiki
} from './FandomWiki'

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

	static interwiki2path( _interwiki: string ): string {
		const interwiki = _interwiki.toLowerCase()

		if ( interwiki.match( /[a-z0-9-]+\.[a-z0-9-]+/ ) ) {
			const [ lang, wikiname ] = interwiki.split( '.' )
			return `https://${ wikiname }.fandom.com/${ lang }`
		} else if ( interwiki.match( /^[a-z0-9-]+$/ ) ) {
			return `https://${ interwiki }.fandom.com`
		}
		throw new InvalidInterwikiError( interwiki )
	}

	static interwiki2api( interwiki: string ): string {
		const path = Fandom.interwiki2path( interwiki )
		return `${ path }/api.php`
	}

	static interwiki2url( interwiki: string ): string {
		const path = Fandom.interwiki2path( interwiki )
		return `${ path }/wiki/`
	}

	static url2interwiki( url: string ): string {
		const nolangRegex = /https?:\/\/([a-z0-9-]+)\.fandom\.com\/(wiki|api|index)/
		const nolang = url.match( nolangRegex )
		if ( nolang ) {
			return nolang[1]
		}

		const langRegex = /https?:\/\/([a-z0-9-]+)\.fandom\.com\/([a-z-]+)\/(wiki|api|index)/
		const lang = url.match( langRegex )

		if ( lang ) {
			return `${ lang[2] }.${ lang[1] }`
		}

		throw new InvalidInterwikiError( url )
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

	getWiki( interwiki: string ): FandomWiki {
		return new FandomWiki( {
			interwiki,
			request: this.request
		} )
	}

	async login( {
		password, username, wiki
	}: { password: string, username: string, wiki?: FandomWiki } ): Promise<FandomBot> {
		const bot = new FandomBot( {
			password,
			username,
			wiki: wiki ?? this.getWiki( 'community' )
		} )

		await bot.login()

		return bot
	}
}
