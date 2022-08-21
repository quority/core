import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `list=allpages`
 */
export interface AllPagesRequest extends QueryRequest {
	/**
	 * When more results are available, use this to continue.
	 */
	apcontinue?: string

	/**
	 * Filter based on whether a page has langlinks. Note that this may not consider langlinks added by extensions.
	 * @default 'all'
	 */
	apfilterlanglinks?: 'all' | 'withlanglinks' | 'withoutlanglinks'

	/**
	 * Which pages to list. \
	 * Due to miser mode, using this may result in fewer than aplimit results returned before continuing; in extreme cases, zero results may be returned.
	 * @default 'all'
	 */
	apfilterredir?: 'all' | 'nonredirects' | 'redirects'

	/**
	 * The page title to start enumerating from.
	 */
	apfrom?: string

	/**
	 * How many total pages to return.
	 */
	aplimit?: number | 'max'

	/**
	 * Limit to pages with at most this many bytes.
	 */
	apmaxsize?: number

	/**
	 * Limit to pages with at least this many bytes.
	 */
	apminsize?: number

	/**
	 * The namespace to enumerate.
	 */
	apnamespace?: number | number[]

	/**
	 * Search for all page titles that begin with this value.
	 */
	apprefix?: string

	/**
	 *     The page title to stop enumerating at.
	 */
	apto?: string

	list: 'allpages'
}

export interface AllPagesItem {
	pageid: number
	ns: number
	title: string
}

export type AllPagesResponse = QueryResponse<
	'ap',
	'allpages',
	AllPagesItem
>
