namespace MWResponse {
	export namespace QueryItem {
		export interface ApiQuery {
			[ key: string ]: string | number | undefined
		}
	}

	export interface ApiQuery {
		batchcomplete?: boolean
		continue?: {
			[ key: string ]: string
		}
		query: {
			[ key: string ]: QueryItem.ApiQuery[]
		}
	}
}