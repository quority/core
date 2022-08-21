import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=images`
 */
export interface ImagesRequest extends QueryRequest {
	prop: 'images'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	imcontinue?: string

	/**
	 * The direction in which to list.
	 */
	imdir?: 'ascending' | 'descending'

	/**
	 * Only list these files. Useful for checking whether a certain page has a certain file.
	 */
	imimages?: MaybeArray<string>

	/**
	 * How many files to return.
	 */
	imlimit?: number | 'max'
}

export interface ImagesItem {
	ns: number
	pageid: number
	title: string
	Images: Array<{
		ns: number
		title: string
	}>
}

export type ImagesResponse = QueryResponse<
	'im',
	'pages',
	ImagesItem
>
