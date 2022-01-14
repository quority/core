// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MediaWikiResponse {
	export interface ApiError {
		error: {
			code: string
			info: string
		}
	}

	export interface Block {
		block: {
			allowusertalk?: boolean
			anononly?: boolean
			autoblock?: boolean
			expiry: string
			hidename?: boolean
			id: number
			nocreate?: boolean
			noemail?: boolean
			reason: string
			user: string
			userID: number
			watchuser?: boolean
		}
	}

	export interface Delete {
		delete: {
			logid: number
			reason: string
			title: string
		}
	}

	export interface Edit {
		edit: {
			newrevid: number
			newtimestamp: string
			oldrevid: number
			pageid: number
			result: string
			title: string
		}
	}

	export interface Login {
		login: {
			lguserid: number
			lgusername: string
			result: 'Success'
		} | {
			reason: string
			result: 'Failed'
		}
	}

	export interface Move {
		move: {
			from: string
			reason?: string
			talkfrom?: string
			talkto?: string
			to: string
		}
	}

	export interface Protect {
		protect: {
			protections: string[]
			reason: string
			title: string
		}
	}

	export interface Purge {
		purge: Array<{
			ns: number
			title: string
		} & (
			{
				missing: string
			} | {
				purged: string
			}
		)>
	}

	export interface Revisions {
		query: {
			pages: Array<{
				missing?: boolean
				pageid: number
				ns: number
				title: string
				revisions: Array<{
					slots: {
						main: {
							contentmodel: string
							contentformat: string
							content: string
						}
					}
				}>
			}>
		}
	}

	export interface Upload {
		upload: {
			result: 'Success' | string
			filename?: string
		}
	}
}
