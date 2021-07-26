interface IApiQueryAllpagesItem extends IApiQueryItem {
	pageid: number
	ns: number
	title: string
}

interface IApiQueryAllpagesResponse extends IApiQueryResponse<IApiQueryAllpagesItem> {
	continue?: {
		apcontinue: string
	}
	query: {
		allpages: IApiQueryAllpagesItem[]
	}
}