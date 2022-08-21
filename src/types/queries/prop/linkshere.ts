import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=linkshere`
 */
export interface LinksHereRequest extends QueryRequest {
	prop: 'linkshere'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	lhcontinue?: string

	/**
	 * How many to return.
	 */
	lhlimit?: number | 'max'

	/**
	 * Only include pages in these namespaces.
	 */
	lhnamespace?: number | number[]

	/**
	 * Which properties to get.
	 */
	lhprop?: MaybeArray<'pageid' | 'title' | 'redirect'>

	/**
	 * Show only items that meet these criteria.
	 */
	lhshow?: 'redirect' | '!redirect'
}

export interface LinksHereItem {
	ns: number
	pageid: number
	title: string
	linkshere: Array<{
		ns: number
		pageid: number
		redirect: boolean
		title: string
	}>
}

export type LinksHereResponse = QueryResponse<
	'lh',
	'pages',
	LinksHereItem
>
