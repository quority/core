import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=deletedrevisions`
 */
export interface DeletedRevisionsRequest extends QueryRequest {
	prop: 'deletedrevisions'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	drvcontinue?: string

	/**
	 * In which direction to enumerate.
	 */
	drvdir?: 'newer' | 'older'

	/**
	 * The timestamp to stop enumerating at. Ignored when processing a list of revision IDs.
	 */
	drvend?: string

	/**
	 * Don't list revisions by this user.
	 */
	drvexcludeuser?: string

	/**
	 * Limit how many revisions will be returned.
	 */
	drvlimit?: number | 'max'

	/**
	 * Which properties to get for each revision.
	 */
	drvprop?: MaybeArray<'ids' | 'flags' | 'timestamp' | 'user' | 'userid' | 'size' | 'slotsize' | 'sha1' | 'slotsha1' | 'contentmodel' | 'comment' | 'parsedcomment' | 'content' | 'tags' | 'roles'>

	/**
	 * Only retrieve the content of the section with this identifier.
	 */
	drvsection?: string

	/**
	 * Which revision slots to return data for, when slot-related properties are included in drvprops. If omitted, data from the main slot will be returned in a backwards-compatible format.
	 */
	drvslots?: string

	/**
	 * The timestamp to start enumerating from. Ignored when processing a list of revision IDs.
	 */
	drvstart?: string

	/**
	 * Only list revisions tagged with this tag.
	 */
	drvtag?: string

	/**
	 * Only list revisions by this user.
	 */
	drvuser?: string
}

export interface DeletedRevisionsItem {
	ns: number
	title: string
	deletedrevisions?: Array<{
		minor: boolean
		parentid: number
		revid: number
		roles: string[]
		sha1: string
		size: number
		slots: {
			comment: string
			main: {
				content: string
				contentformat: string
				contentmodel: string
				sha1: string
				size: number
			}
			parsedcomment: string
			tags: string[]
		}
		timestamp: string
		user: string
		userid: number
	}>
	missing?: true
	pageid: number
}

export type DeletedRevisionsResponse = QueryResponse<
	'drv',
	'pages',
	DeletedRevisionsItem
>
