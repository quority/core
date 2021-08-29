export namespace SiteInfo {
	export interface SiteInfoQuery {
		general: {
				mainpage: string
				base: string
				sitename: string
				lang: string
				readonly: boolean
				writeapi: boolean
				articlepath: string
				scriptpath: string
				script: string
				server: string
				servername: string
				wikiid: string
		}
		namespaces: {
			[ key: string ]: {
				id: number
				name: string
				subpages: boolean
				content: boolean
				canonical?: string
			}
		}
		interwikimap: {
			prefix: string
			local?: boolean
			url: string
			language?: string
		}
		statistics: {
			pages: number
			articles: number
			edits: number
			images: number
			users: number
			activeusers: number
			admins: number
		}
		usergroups: {
			name: string
			rights: string[]
		}[]
		extensions: {
			type: string
			name: string
			descriptionmsg: string
			author: string
			url: string
		}[]
		restrictions: {
			types: string[]
			levels: string[]
			cascadinglevels: string[]
			semiprotectedlevels: string[]
		}
		languages: {
			code: string
			name: string
		}[]
		skins: {
			code: string
			name: string
			default?: boolean
			unusable?: boolean
		}[]
	}

	export type WikiLoadable = keyof SiteInfoQuery
	export type SiteInfo<Query extends SiteInfoQuery = SiteInfoQuery, Props extends keyof Query = WikiLoadable> = {
		query: Pick<Query, Props>
	}
}
