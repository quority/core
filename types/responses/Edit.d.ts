namespace MWResponse {
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
}