import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=transcludedin`
 */
export interface TranscludedInRequest extends QueryRequest {
	prop: 'transcludedin'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	ticontinue?: string

	/**
	 * How many to return.
	 */
	tilimit?: number | 'max'

	/**
	 * Only include pages in these namespaces.
	 */
	tinamespace?: number | number[]

	/**
	 * Which properties to get.
	 */
	tiprop?: MaybeArray<'pageid' | 'title' | 'redirect'>

	/**
	 * Show only items that meet these criteria.
	 */
	tishow?: 'redirect' | '!redirect'
}

export interface TranscludedInItem {
	ns: number
	pageid: number
	title: string
	transcludedin: Array<{
		ns: number
		pageid: number
		redirect: boolean
		title: string
	}>
}

export type TranscludedInResponse = QueryResponse<
	'ti',
	'pages',
	TranscludedInItem
>
