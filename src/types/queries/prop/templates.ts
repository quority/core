import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=templates`
 */
export interface TemplatesRequest extends QueryRequest {
	prop: 'templates'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	tlcontinue?: string

	/**
	 * The direction in which to list.
	 */
	tldir?: 'ascending' | 'descending'

	/**
	 * How many templates to return.
	 */
	tllimit?: number | 'max'

	/**
	 * Show Templates in these namespaces only.
	 */
	tlnamespace?: MaybeArray<number>

	/**
	 * Only list these templates. Useful for checking whether a certain page uses a certain template.
	 */
	tltemplates?: MaybeArray<string>
}

export interface TemplatesItem {
	ns: number
	pageid: number
	title: string
	Templates: Array<{
		ns: string
		title: string
	}>
}

export type TemplatesResponse = QueryResponse<
	'tl',
	'pages',
	TemplatesItem
>
