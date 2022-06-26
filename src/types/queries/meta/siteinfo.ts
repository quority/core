import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { Response } from '../../Response'

/**
 * Options for `meta=siteinfo`.
 */
export interface SiteInfoRequest extends QueryRequest {
	meta: 'siteinfo'

	/**
	 * Return only local or only nonlocal entries of the interwiki map.
	 */
	sifilteriw?: 'local' | '!local'

	/**
	 * Language code for localised language names (best effort) and skin names.
	 */
	siinlanguagecode?: string

	/**
	 * Lists the number of users in user groups.
	 */
	sinumberingroup?: boolean

	/**
	 * Which information to get.
	 */
	siprop: MaybeArray<'general' | 'namespaces' | 'namespacealiases' | 'specialpagealiases' | 'magicwords' | 'interwikimap' | 'dbrepllag' | 'statistics' | 'usergroups' | 'libraries' | 'extensions' | 'fileextensions' | 'rightsinfo' | 'restrictions' | 'languages' | 'languagevariants' | 'skins' | 'extensiontags' | 'functionhooks' | 'showhooks' | 'variables' | 'protocols' | 'defaultoptions' | 'uploaddialog'>

	/**
	 * List all database servers, not just the one lagging the most.
	 */
	sishowalldb?: boolean
}

export interface SiteInfoResponse extends Response {
	query: {
		dbrepllag: Array<{
			host: string
			lag: number
		}>
		defaultoptions: Record<string, unknown>
		extensions: Array<{
			author: string
			descriptionmsg: string
			license: string
			'license-name': string
			name: string
			type: string
			url: string
			version: string
		}>
		extensiontags: string[]
		fileextensions: Array<{
			ext: string
		}>
		functionhooks: string[]
		general: {
			allunicodefixes: boolean
			articlepath: string
			base: string
			case: string
			dbtype: string
			dbversion: string
			externalimages: string[]
			favicon: string
			generator: string
			imagewhitelistenabled: boolean
			invalidusernamechars: string
			lang: string
			langconversion: boolean
			legaltitlechars: string
			linktrail: string
			logo: string
			mainpage: string
			maxarticlesize: number
			maxuploadsize: number
			minuploadchunksize: number
			misermode: boolean
			phpversion: string
			readonly: boolean
			script: string
			scriptpath: string
			server: string
			servername: string
			sitename: string
			timezone: string
			titleconversion: boolean
			uploadsenabled: boolean
			wikiid: string
			writeapi: boolean
		}
		interwikimap: Array<{
			api?: string
			local?: boolean
			prefix: string
			url: string
			wikiid?: string
		} | {
			language: string
			local: true
			prefix: string
			url: string
		}>
		languages: Array<{
			bcp47: string
			code: string
			name: string
		}>
		languagevariants: Record<string, unknown>
		libraries: Array<{
			name: string
			version: unknown
		}>
		magicwords: Array<{
			aliases: string[]
			'case-sensitive': boolean
			name: string
		}>
		namespaces: Array<{
			canonical?: string
			content: boolean
			id: number
			name: string
			noincludable: boolean
			subpages: boolean
		}>
		namespacealiases: Array<{
			alias: string
			id: number
		}>
		protocols: string[]
		rightsinfo: {
			text: string
			url: string
		}
		restrictions: {
			cascadinglevels: string[]
			levels: string[]
			semiprotectedlevels: string[]
			types: string[]
		}
		showhooks: Array<{
			name: string
			subscribers: string[]
		}>
		skins: Array<{
			code: string
			default?: boolean
			name: string
			unusable?: boolean
		}>
		specialpagealiases: Array<{
			aliases: string[]
			realname: string
		}>
		statistics: {
			activeusers: number
			admins: number
			articles: number
			edits: number
			images: number
			jobs: number
			pages: number
			users: number
		}
		uploaddialog: {
			comment: {
				foreign: string
				local: string
			}
			fields: {
				categories: boolean
				date: boolean
				description: boolean
			}
			format: {
				description: string
				filepage: string
				license: string
				onwork: string
				uncategorized: string
			}
			licensemessages: {
				foreign: string
				local: string
			}
		}
		usergroups: Array<{
			name: string
			rights: string[]
		}>
		variables: Array<{
			id: string
			'*': unknown
		}>
	}
}
