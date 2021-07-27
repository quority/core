interface IApiRevisionsItem {
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

interface IApiRevisionsResponse {
	query: {
		pages: IApiRevisionsItem[]
	}
}