import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=duplicatefiles`
 */
export interface DuplicateFilesRequest extends QueryRequest {
	prop: 'duplicatefiles'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	dfcontinue?: string

	/**
	 * In which direction to enumerate.
	 */
	dfdir?: 'ascending' | 'descending'

	/**
	 * Limit how many revisions will be returned.
	 */
	dflimit?: number | 'max'

	/**
	 * Look only for files in the local repository.
	 */
	dflocalonly?: boolean
}

export interface DuplicateFilesItem {
	duplicatefiles: Array<{
		name: string
		shared: boolean
		timestamp: string
		user: string
	}>
	known?: boolean
	missing?: true
	ns: number
	title: string
}

export type DuplicateFilesResponse = QueryResponse<
	'df',
	'pages',
	DuplicateFilesItem
>
