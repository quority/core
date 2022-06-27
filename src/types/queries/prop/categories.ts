import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=categories`
 */
export interface CategoriesRequest extends QueryRequest {
	prop: 'categories'

	titles: string | string[]

	/**
	 * Only list these categories. Useful for checking whether a certain page is in a certain category.
	 */
	clcategories?: MaybeArray<string>

	/**
	 * When more results are available, use this to continue.
	 */
	clcontinue?: string

	/**
	 * The direction in which to list.
	 */
	cldir?: 'ascending' | 'descending'

	/**
	 * How many categories to return.
	 */
	cllimit?: number | 'max'

	/**
	 * Which additional properties to get for each category.
	 */
	clprop?: MaybeArray<'hidden' | 'sortkey' | 'timestamp'>

	/**
	 * Which kind of categories to show.
	 */
	clshow?: MaybeArray<'!hidden' | 'hidden'>
}

export interface CategoriesItem {
	ns: number
	pageid: number
	title: string
	categories: Array<{
		hidden?: boolean
		ns: number
		sortkey: string
		sortkeyprefix: string
		timestamp: string
		title: string
	}>
}

export type CategoriesResponse = QueryResponse<
	'cl',
	'pages',
	CategoriesItem
>
