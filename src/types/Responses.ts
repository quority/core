import {
	RequireOnlyOne
} from './utils'
import {
	TokenType
} from './Tokens'

export namespace MWResponses {
	export interface ApiError {
		error: {
			code: string
			info: string
		}
	}

	export interface Block {
		block: {
			user: string
			userID: number
			expiry: string
			id: number
			reason: string
			anononly?: boolean
			nocreate?: boolean
			autoblock?: boolean
			noemail?: boolean
			hidename?: boolean
			allowusertalk?: boolean
			watchuser?: boolean
		}
	}

	export interface Delete {
		delete: {
			title: string
			reason: string
			logid: number
		}
	}

	export interface Edit {
		edit: {
			result: string
			pageid: number
			title: string
			oldrevid: number
			newrevid: number
			newtimestamp: string
		}
	}

	export interface InterwikiMap {
		query: {
			interwikimap: {
				prefix: 'string'
				language: string
				url: string
			}[]
		}
	}

	export interface Login {
		login: {
			result: 'Success'
			lguserid: number
			lgusername: string
		} | {
			result: 'Failed'
			reason: string
		}
	}

	export interface Move {
		move: {
			from: string
			to: string
			reason?: string
			talkfrom?: string
			talkto?: string
		}
	}

	export type Protect = {
		protect: {
			title: string
			reason: string
			protections: ( {
				expiry: string
			} & RequireOnlyOne<{
				edit?: string
				move: string
			}, 'edit' | 'move'> )[]
		}
	}

	export interface Purge {
		purge: ( {
			ns: number
			title: string
		} & (
			{
				missing: string
			} | {
				purged: string
			}
		) )[]
	}

	export interface RevisionsItem {
		missing?: boolean
		pageid: number
		ns: number
		title: string
		revisions: {
			slots: {
				main: {
					contentmodel: string
					contentformat: string
					content: string
				}
			}
		}[]
	}

	export interface Revisions {
		query: {
			pages: RevisionsItem[]
		}
	}

	export interface GeneralSiteInfo {
		mainpage: string
		base: string
		sitename: string
		readonly: boolean
		writeapi: boolean
		articlepath: string
		scriptpath: string
		script: string
		server: string
		wikiid: string
	}

	export type SiteInfoNamespace = {
		id: 0
		name: ''
		content: true
	} | {
		id: number
		name: string
		canonical: string
		content: boolean
	}

	export type SiteInfoVariables = {
		id: 'wgLanguageCode'
		'*': string
	} | {
		id: 'wgCityId'
		'*': number
	}

	export interface SiteInfo {
		query: {
			general: GeneralSiteInfo
			namespaces: Record<`${ number }`, SiteInfoNamespace>
			variables: SiteInfoVariables[]
		}
	}

	export interface Tokens<T extends TokenType> {
		query: {
			tokens: {
				[ key in `${ T }token` ]: string
			}
		}
	}

	export interface Upload {
		upload: {
			result: 'Success' | string
			filename?: string
		}
	}
}
