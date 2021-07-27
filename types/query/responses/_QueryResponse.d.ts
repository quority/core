interface IApiQueryItem {
	[ key: string ]: string | number | undefined
}

interface IApiQueryResponse<T extends IApiQueryItem> {
	batchcomplete?: boolean
	continue?: {
		[ key: string ]: string
	}
	query: {
		[ key: string ]: T[]
	}
}