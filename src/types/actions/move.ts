import type { ActionRequest } from '../Request'
import type { RequireOnlyOne } from '../utils'

interface BaseMoveRequest extends ActionRequest {
	action: 'move'

	/**
	 * Title of the page to rename.
	 */
	from: string

	/**
	 * Page ID of the page to rename.
	 */
	fromid: number

	/**
	 * Ignore any warnings.
	 */
	ignorewarnings?: boolean

	/**
	 * Rename subpages, if applicable.
	 */
	movesubpages?: boolean

	/**
	 * Rename the talk page, if it exists.
	 */
	movetalk?: boolean

	/**
	 * Don't create a redirect.
	 * @default false
	 */
	noredirect?: boolean

	/**
	 * Reason for the rename.
	 */
	reason?: string

	/**
	 * Title to rename the page to.
	 */
	to: string
}

/**
 * Options to move a page.
 */
export type MoveRequest = RequireOnlyOne<BaseMoveRequest, 'from', 'fromid'>

export interface MoveResponse extends Response {
	move: {
		from: string
		reason?: string
		talkfrom?: string
		talkto?: string
		to: string
	}
}
