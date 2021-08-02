namespace MWResponse {
	export namespace QueryItem {
		export interface AllImages extends QueryItem.ApiQuery {
			name: string
			timestamp: string
			url: string
			descriptionurl: string
			descriptionshorturl: string
			ns: number
			title: string
		}
	}

	export interface AllImages extends MWResponse.ApiQuery {
		continue: {
			aicontinue: string
		}
		query: {
			allimages: QueryItem.AllImages[]
		}
	}
}