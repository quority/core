import type { MaybeArray, RequireOnlyOne } from '../utils'
import type { ActionRequest } from '../Request'

interface BaseUndeleteRequest extends ActionRequest {
	action: 'undelete'

	/**
	 * IDs of the file revisions to restore. If both timestamps and fileids are empty, all will be restored.
	 */
	fileids?: MaybeArray<number>

	/**
	 * Page ID of the page to delete.
	 */
	pageid: number

	/**
	 * Reason for restoring.
	 */
	reason?: string

	/**
	 * Change tags to apply to the entry in the deletion log.
	 */
	tags?: MaybeArray<string>

	/**
	 * Timestamps of the revisions to undelete. If both timestamps and fileids are empty, all will be undeleted.
	 */
	timestamps?: MaybeArray<string>

	/**
	 * Title of the page to undelete.
	 */
	title: string

	/**
	 * A "csrf" token.
	 */
	token: string

	/**
	 * Undelete all revisions of the associated talk page, if any.
	 */
	undeletetalk?: boolean
}

/**
 * Options to delete a page.
 */
export type UndeleteRequest = RequireOnlyOne<BaseUndeleteRequest, 'title', 'pageid'>

export interface UndeleteResponse extends Response {
	undelete: {
		fileversions: number
		reason: string
		revisions: number
		title: string
	}
}
