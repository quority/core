namespace MWResponse {
	export namespace QueryItem {
		export interface UserContribs extends QueryItem.ApiQuery {
			userid: number
			user: string
			pageid: number
			revid: number
			parentid: number
			ns: number
			title: string
			timestamp: string
			comment: string
			size: number
		}
	}

	export interface UserContribs extends MWResponse.ApiQuery {
		continue: {
			uccontinue: string
		}
		query: {
			usercontribs: QueryItem.UserContribs[]
		}
	}
}