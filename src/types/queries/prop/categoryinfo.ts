import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=categoryinfo`
 */
export interface CategoryInfoRequest extends QueryRequest {
	prop: 'categoryinfo'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	cicontinue?: string
}

export type CategoryInfoItem = {
	ns: number
	title: string
} & (
	{ missing: true }
	| {
		categoryinfo: {
			files: number
			hidden: boolean
			pages: number
			size: number
			subcats: number
		}
		missing?: false
	}
)

export type CategoryInfoResponse = QueryResponse<
	'ci',
	'pages',
	CategoryInfoItem
>
