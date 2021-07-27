interface IApiQueryAllimagesItem extends IApiQueryItem {
	name: string
	timestamp: string
	url: string
	descriptionurl: string
	descriptionshorturl: string
	ns: number
	title: string
}

interface IApiQueryAllimagesResponse extends IApiQueryResponse<IApiQueryAllimagesItem> {
	continue?: {
		aicontinue: string
	}
	query: {
		allimages: IApiQueryAllimagesItem[]
	}
}