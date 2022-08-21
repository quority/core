import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=redirects`
 */
export interface RedirectsRequest extends QueryRequest {
	prop: 'redirects'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	rdcontinue?: string

	/**
	 * The direction in which to list.
	 */
	rddir?: 'ascending' | 'descending'

	/**
	 * How many Redirects to return.
	 */
	rdlimit?: number | 'max'

	/**
	 * Show redirects in these namespaces only.
	 */
	rdnamespace?: MaybeArray<number>

	/**
	 * Which properties to get.
	 */
	rdprop?: MaybeArray<'fragment' | 'pageid' | 'title'>

	/**
	 * Show only items that meet these criteria.
	 */
	rdshow?: MaybeArray<'!fragment' | 'fragment'>
}

export interface RedirectsItem {
	ns: number
	pageid: number
	title: string
	redirects: Array<{
		ns: string
		pageid: number
		title: string
	}>
}

export type RedirectsResponse = QueryResponse<
	'rd',
	'pages',
	RedirectsItem
>
