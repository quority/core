import {
	Bot
} from '../_base'
import {
	FandomWiki
} from './FandomWiki'

export class FandomBot extends Bot<FandomWiki> {
	#_wikis = new Set<string>()

	constructor( {
		password, username, wiki
	}: { password: string, username: string, wiki: FandomWiki } ) {
		super( {
			password,
			username,
			wiki
		} )
		this.#_wikis.add( wiki.interwiki )
	}

	async setWiki( wiki: FandomWiki ): Promise<void> {
		this.wiki = wiki

		if ( !this.#_wikis.has( wiki.interwiki ) ) {
			await this.login()
			this.#_wikis.add( wiki.interwiki )
		}
	}
}
