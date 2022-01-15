import { Fandom } from './Fandom'
import type { Loaded } from '../_base'
import type { RequestManager } from '../../utils'
import { Wiki } from '../_base'

export class FandomWiki extends Wiki {
	public readonly interwiki: string
	public id?: number

	public constructor( {
		interwiki, request
	}: { interwiki: string, request: RequestManager } ) {
		super( {
			api: Fandom.interwiki2api( interwiki ),
			request
		} )

		this.interwiki = interwiki
	}

	public override getURL( title: string ): string {
		const base = this.api.replace( '/api.php', '/wiki/' )
		return new URL( title, base ).href
	}

	public override async load(): Promise<Loaded<this>> {
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

		this.id = siteinfo.query.variables.find( i => i.id === 'wgCityId' )?.[ '*' ] as number

		return this as Loaded<this>
	}
}
