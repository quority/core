import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `list=allcategories`
 */
export interface AllCategoriesRequest extends QueryRequest {
	/**
	 * When more results are available, use this to continue.
	 */
	accontinue?: string

	/**
	 * Direction to sort in.
	 */
	acdir?: 'ascending' | 'descending'

	/**
	 * The category to start enumerating from.
	 */
	acfrom?: string

	/**
	 * How many categories to return.
	 */
	aclimit?: number | 'max'

	/**
	 * Only return categories with at most this many members.
	 */
	acmax?: number

	/**
	 * Only return categories with at least this many members.
	 */
	acmin?: number

	/**
	 * Search for all category titles that begin with this value.
	 */
	acprefix?: string

	/**
	 * Which properties to get.
	 * `size`: Adds number of pages in the category.
	 * `hidden`: Tags categories that are hidden with `__HIDDENCAT__`.
	 */
	acprop?: MaybeArray<'size' | 'hidden'>

	/**
	 * The category to stop enumerating at.
	 */
	acto?: string

	list: 'allcategories'
}

export interface AllCategoriesItem {
	category: string
}

export type AllCategoriesResponse = QueryResponse<
	'ac',
	'allcategories',
	AllCategoriesItem
>
