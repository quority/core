import type { ActionRequest } from '../Request'
import type { RequireOnlyOneFromThree } from '../utils'

interface BaseEditRequest extends ActionRequest {
	action: 'edit'

	/**
	 * Add this text to the end of the page.
	 */
	appendtext?: string

	/**
	 * Mark this edit as a bot edit.
	 */
	bot?: boolean

	/**
	 * Don't edit the page if it exists already.
	 */
	createonly?: boolean

	/**
	 * Mark this edit as a minor edit.
	 */
	minor?: boolean

	/**
	 * Throw an error if the page doesn't exist.
	 */
	nocreate?: boolean

	/**
	 * Do not mark this edit as a minor edit even if the "Mark all edits minor by default" user preference is set.
	 */
	notminor?: boolean

	/**
	 * Page ID of the page to edit.
	 */
	pageid?: number

	/**
	 * Add this text to the beginning of the page.
	 */
	prependtext?: string

	/**
	 * Override any errors about the page having been deleted in the meantime.
	 */
	recreate?: boolean

	/**
	 * Page content.
	 */
	text: string

	/**
	 * Title of the page to edit.
	 */
	title?: string

	/**
	 * Undo this revision. The value must be no less than 0.
	 */
	undo?: number

	/**
	 * Undo all revisions from undo to this one. If not set, just undo one revision. The value must be no less than 0.
	 */
	undoafter?: number

	/**
	 * Edit summary.
	 */
	summary?: string
}

/**
 * Options to edit a page.
 */
export type EditRequest = RequireOnlyOneFromThree<BaseEditRequest, 'appendtext', 'prependtext', 'text'>

export interface EditResponse extends Response {
	edit: {
		newrevid: number
		newtimestamp: string
		oldrevid: number
		pageid: number
		result: string
		title: string
	}
}
