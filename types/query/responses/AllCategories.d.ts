interface IApiQueryAllcategoriesItem extends IApiQueryItem {
	category: string
}

interface IApiQueryAllcategoriesResponse extends IApiQueryResponse<IApiQueryAllcategoriesItem> {
	continue: {
		accontinue: string
	}
	query: {
		allcategories: IApiQueryAllcategoriesItem[]
	}
}