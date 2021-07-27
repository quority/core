interface IApiQueryUsercontribsItem extends IApiQueryItem {
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

interface IApiQueryUsercontribsResponse extends IApiQueryResponse<IApiQueryUsercontribsItem> {
	continue?: {
		aicontinue: string
	}
	query: {
		usercontribs: IApiQueryUsercontribsItem[]
	}
}