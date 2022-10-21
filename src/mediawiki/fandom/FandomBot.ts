import { Bot } from '../_base'
import type { FandomWiki } from './FandomWiki'

export class FandomBot extends Bot<FandomWiki> {
	#_wikis = new Set<string>()

	public constructor( {
		password, username, wiki
	}: { password: string, username: string, wiki: FandomWiki } ) {
		super( {
			password,
			username,
			wiki
		} )
		this.#_wikis.add( wiki.interwiki )
	}

	public async setWiki( wiki: FandomWiki ): Promise<void> {
		this.wiki = wiki

		if ( !this.#_wikis.has( wiki.interwiki ) ) {
			await this.login()
			this.#_wikis.add( wiki.interwiki )
		}

		this.csrf = null
	}
}
