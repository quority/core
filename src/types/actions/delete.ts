import type { ActionRequest } from '../Request'
import type { RequireOnlyOne } from '../utils'

interface BaseDeleteRequest extends ActionRequest {
	action: 'delete'

	/**
	 * Page ID of the page to delete.
	 */
	pageid: number

	/**
	 * Reason for the deletion. If not set, an automatically generated reason will be used.
	 */
	reason?: string

	/**
	 * Title of the page to delete.
	 */
	title: string
}

/**
 * Options to delete a page.
 */
export type DeleteRequest = RequireOnlyOne<BaseDeleteRequest, 'title', 'pageid'>

export interface DeleteResponse extends Response {
	delete: {
		logid: number
		reason: string
		title: string
	}
}
