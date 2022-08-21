import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=iwlinks`
 */
export interface IwLinksRequest extends QueryRequest {
	prop: 'iwlinks'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	iwcontinue?: string

	/**
	 * The direction in which to list.
	 */
	iwdir?: 'ascending' | 'descending'

	/**
	 * How many interwiki links to return.
	 */
	iwlimit?: number | 'max'

	/**
	 * Only return interwiki links with this prefix.
	 */
	iwprefix?: string

	/**
	 * Which additional properties to get for each interwiki link.
	 */
	iwprop?: MaybeArray<'url'>

	/**
	 * Interwiki link to search for. Must be used with `iwprefix`.
	 */
	iwtitle?: string
}

export interface IwLinksItem {
	ns: number
	pageid: number
	title: string
	iwlinks: Array<{
		prefix: string
		title: string
		url: string
	}>
}

export type IwLinksResponse = QueryResponse<
	'iw',
	'pages',
	IwLinksItem
>
