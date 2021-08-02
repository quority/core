namespace MWResponse {
	export namespace QueryItem {
		export interface AllCategories extends QueryItem.ApiQuery {
			category: string
		}
	}

	export interface AllCategories extends MWResponse.ApiQuery {
		continue: {
			accontinue: string
		}
		query: {
			allcategories: QueryItem.AllCategories[]
		}
	}
}