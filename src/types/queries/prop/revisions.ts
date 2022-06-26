import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

export interface RevisionsRequest extends QueryRequest {
	prop: 'revisions'

	/**
	 * When more results are available, use this to continue.
	 */
	rvcontinue?: string

	/**
	 * In which direction to enumerate.
	 */
	rvdir?: 'newer' | 'older'

	/**
	 * Enumerate up to this timestamp.
	 */
	rvend?: string

	/**
	 * Stop enumeration at this revision's timestamp. The revision must exist, but need not belong to this page.
	 */
	rvendid?: number

	/**
	 * Exclude revisions made by user.
	 */
	rvexcludeuser?: string

	/**
	 * Limit how many revisions will be returned.
	 */
	rvlimit?: number | 'max'

	/**
	 * Which properties to get for each revision.
	 */
	rvprop?: MaybeArray<'ids' | 'flags' | 'timestamp' | 'user' | 'userid' | 'size' | 'slotsize' | 'sha1' | 'slotsha1' | 'contentmodel' | 'comment' | 'parsedcomment' | 'content' | 'tags' | 'roles'>

	/**
	 * Which revision slots to return data for, when slot-related properties are included in rvprops. If omitted, data from the main slot will be returned in a backwards-compatible format.
	 */
	rvslots?: 'main' | '*'

	/**
	 * From which revision timestamp to start enumeration.
	 */
	rvstart?: string

	/**
	 * Start enumeration from this revision's timestamp. The revision must exist, but need not belong to this page.
	 */
	rvstartid?: number

	/**
	 * Only list revisions tagged with this tag.
	 */
	rvtag?: string

	/**
	 * Only include revisions made by user.
	 */
	rvuser?: string
}

export type RevisionsItem = {
	ns: number
	title: string
} & ( {
	missing: true
	} | {
	missing?: undefined
	pageid: number
	revisions: [ {
		slots: {
			main: {
				contentmodel: string
				contentformat: string
				content: string
			}
		}
	} ]
} )

export type RevisionsResponse = QueryResponse<
	'rv',
	'pages',
	RevisionsItem
>
