namespace MWResponse {
	export namespace QueryItem {
		export interface CategoryMembers extends QueryItem.ApiQuery {
			pageid: number
			ns: number
			title: string
		}
	}

	export interface CategoryMembers extends MWResponse.ApiQuery {
		continue: {
			cmcontinue: string
		}
		query: QueryItem.CategoryMembers[]
	}
}