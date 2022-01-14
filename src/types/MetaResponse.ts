import type {
	TokenType
} from './utils'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MediaWikiMetaResponse {
	export interface MetaResponse {
		batchcomplete?: ''
	}

	export interface AllMessages extends MetaResponse {
		query: {
			allmessages: Array<{
				name: string
				normalizedname: string
				'*': string
			}>
		}
	}

	export interface FileRepoInfo extends MetaResponse {
		query: {
			repos: Array<{
				displayname: string
				name: string
				url: string
			}>
		}
	}

	export interface SiteInfo extends MetaResponse {
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

	export interface Tokens<T extends TokenType = TokenType> extends MetaResponse {
		query: {
			tokens: {
				[ key in `${ T }token` ]: string
			}
		}
	}

	export interface UserInfo extends MetaResponse {
		query: {
			userinfo: {
				groups: string[]
				id: number
				name: string
				rights: string[]
			}
		}
	}
}
