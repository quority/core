type ApiQueryList = 'allcategories' | 'allimages' | 'allpages' | 'categorymembers'
interface IApiQueryItem {
	[ key: string ]: string | number | undefined
}

interface IApiQueryResponse<T extends IApiQueryItem> {
	batchcomplete?: boolean
	continue?: {
		[ key: string ]: string
	}
	query: {
		[ key in ApiQueryList ]: T[]
	}
}