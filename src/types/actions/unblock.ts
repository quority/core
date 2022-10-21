import type { ActionRequest } from '../Request'
import type { MaybeArray } from '../utils'

/**
 * Options to block an user.
 */
export interface UnblockRequest extends ActionRequest {
	action: 'unblock'

	/**
	 * ID of the block to unblock (obtained through `list=blocks`). Cannot be used together with `user`.
	 */
	id?: number

	/**
	 * Reason for unblock.
	 */
	reason?: string

	/**
	 * Change tags to apply to the entry in the block log.
	 */
	tags?: MaybeArray<string>

	/**
	 * User to unblock. Cannot be used together with `id`.
	 */
	user?: string
}

export interface UnblockResponse extends Response {
	unblock: {
		id: string
		reason: string
		user: string
		userid: number
	}
}
