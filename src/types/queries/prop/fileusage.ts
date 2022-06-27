import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=fileusage`
 */
export interface FileUsageRequest extends QueryRequest {
	prop: 'fileusage'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	fucontinue?: string

	/**
	 * Limit how many revisions will be returned.
	 */
	fulimit?: number | 'max'

	/**
	 * Only include pages in these namespaces.
	 */
	funamespace: MaybeArray<number>

	/**
	 * Which properties to get.
	 */
	fuprop?: MaybeArray<'pageid' | 'redirect' | 'title'>

	/**
	 * Show only items that meet these criteria.
	 */
	fushow?: MaybeArray<'!redirect' | 'redirect'>
}

export interface FileUsageItem {
	fileusage: Array<{
		ns: number
		pageid: number
		redirect?: boolean
		title: string
	}>
	ns: number
	pageid: number
	title: string
}

export type FileUsageResponse = QueryResponse<
	'fu',
	'pages',
	FileUsageItem
>
