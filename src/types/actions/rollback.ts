import type { MaybeArray, RequireOnlyOne } from '../utils'
import type { ActionRequest } from '../Request'

interface BaseRollbackRequest extends ActionRequest {
	action: 'rollback'

	/**
	 * Mark the reverted edits and the revert as bot edits.
	 */
	markbot?: boolean

	/**
	 * Page ID of the page to roll back. Cannot be used together with `title`.
	 */
	pageid: number

	/**
	 * Custom edit summary. If empty, default summary will be used.
	 */
	summary?: string

	/**
	 * Tags to apply to the rollback.
	 */
	tags?: MaybeArray<string>

	/**
	 * Title of the page to roll back. Cannot be used together with `pageid`.
	 */
	title: string

	/**
	 * A "rollback" (CSRF) token.
	 */
	token: string

	/**
	 * Name of the user whose edits are to be rolled back.
	 */
	user: string
}

/**
 * Options to Rollback the cache for the given titles.
 */
export type RollbackRequest = RequireOnlyOne<BaseRollbackRequest, 'pageid', 'title'>

export interface RollbackResponse extends Response {
	rollback: {
		last_revid: number
		old_revid: number
		pageid: number
		revid: number
		summary: string
		title: string
	}
}
