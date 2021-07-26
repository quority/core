interface IApiQueryCategorymembersItem extends IApiQueryItem {
	pageid: number
	ns: number
	title: string
}

interface IApiQueryCategorymembersResponse extends IApiQueryResponse<IApiQueryCategorymembersItem> {
	continue?: {
		cmcontinue: string
	}
	query: {
		categorymembers: IApiQueryCategorymembersItem[]
	}
}