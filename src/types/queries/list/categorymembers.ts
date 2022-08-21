import type { MaybeArray, RequireOnlyOne } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

interface BaseCategoryMembersRequest extends QueryRequest {
	/**
	 * When more results are available, use this to continue.
	 */
	cmcontinue?: string

	/**
	 * In which direction to sort.
	 */
	cmdir?: 'ascending' | 'descending' | 'newer' | 'older'

	/**
	 * Timestamp to end listing at. Can only be used with `cmsort=timestamp`.
	 */
	cmend?: string

	/**
	 * The maximum number of pages to return.
	 */
	cmlimit?: number | 'max'

	/**
	 * Only include pages in these namespaces. Note that `cmtype=subcat` or `cmtype=file` may be used instead of `cmnamespace=14` or `6`. \
	 * Due to miser mode, using this may result in fewer than cmlimit results returned before continuing; in extreme cases, zero results may be returned.
	 */
	cmnamespace?: number | number[]

	/**
	 * Page ID of the category to enumerate.
	 */
	cmpageid: number

	/**
	 * Which pieces of information to include.
	 */
	cmprop?: MaybeArray<'ids' | 'title' | 'sortkey' | 'sortkeyprefix' | 'type' | 'timestamp'>

	/**
	 * Property to sort by.
	 */
	cmsort?: 'sortkey' | 'timestamp'

	/**
	 * Timestamp to start listing from. Can only be used with `cmsort=timestamp`.
	 */
	cmstart?: string

	/**
	 * Which category to enumerate (required). Must include the `Category:` prefix.
	 */
	cmtitle: string

	/**
	 * Which type of category members to include. Ignored when `cmsort=timestamp` is set.
	 */
	cmtype?: MaybeArray<'file' | 'page' | 'subcat'>

	list: 'categorymembers'
}

/**
 * Options for `list=categorymembers`
 */
export type CategoryMembersRequest = RequireOnlyOne<BaseCategoryMembersRequest, 'cmpageid', 'cmtitle'>

export interface CategoryMembersItem {
	pageid: number
	ns: number
	title: string
}

export type CategoryMembersResponse = QueryResponse<
	'cm',
	'categorymembers',
	CategoryMembersItem
>
