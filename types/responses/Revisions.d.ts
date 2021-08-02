namespace MWResponse {
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
}