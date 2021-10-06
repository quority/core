import {
	Loaded, Wiki
} from '../_base'
import {
	Logger, RequestManager
} from '../../utils'
import {
	Fandom
} from './Fandom'

export class FandomWiki extends Wiki {
	readonly interwiki: string
	id?: number

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

	override getURL( title: string ): string {
		const base = this.api.replace( '/api.php', '/wiki/' )
		return new URL( title, base ).href
	}

	async load(): Promise<Loaded<this>> {
		const siteinfo = await this.getSiteInfo( 'general', 'variables' )

		this.mainpage = siteinfo.query.general.mainpage
		this.base = siteinfo.query.general.base
		this.sitename = siteinfo.query.general.sitename
		this.lang = siteinfo.query.general.lang
		this.readonly = siteinfo.query.general.readonly
		this.writeapi = siteinfo.query.general.writeapi
		this.articlepath = siteinfo.query.general.articlepath
		this.scriptpath = siteinfo.query.general.scriptpath
		this.script = siteinfo.query.general.script
		this.server = siteinfo.query.general.server
		this.servername = siteinfo.query.general.servername
		this.wikiid = siteinfo.query.general.wikiid

		this.id = siteinfo.query.variables.find( i => i.id === 'wgCityId' )?.['*'] as number

		return this as Loaded<this>
	}
}
