namespace MWResponse {
	export namespace QueryItem {
		export interface AllPages extends QueryItem.ApiQuery {
			pageid: number
			ns: number
			title: string
		}
	}

	export interface AllPages extends MWResponse.ApiQuery {
		continue: {
			apcontinue: string
		}
		query: {
			allpages: QueryItem.AllPages[]
		}
	}
}