import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=links`
 */
export interface LinksRequest extends QueryRequest {
	prop: 'links'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	plcontinue?: string

	/**
	 * The direction in which to list.
	 */
	pldir?: 'ascending' | 'descending'

	/**
	 * How many links to return.
	 */
	pllimit?: number | 'max'

	/**
	 * Show links in these namespaces only.
	 */
	plnamespace?: MaybeArray<number>

	/**
	 * Only list links to these titles. Useful for checking whether a certain page links to a certain title.
	 */
	pltitles?: MaybeArray<string>
}

export interface LinksItem {
	ns: number
	pageid: number
	title: string
	links: Array<{
		ns: string
		title: string
	}>
}

export type LinksResponse = QueryResponse<
	'll',
	'pages',
	LinksItem
>
