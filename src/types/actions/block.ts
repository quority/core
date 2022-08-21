import type { ActionRequest } from '../Request'

/**
 * Options to block an user.
 */
export interface BlockRequest extends ActionRequest {
	action: 'block'

	/**
	 * Allow the user to edit their own talk page.
	 */
	allowusertalk?: boolean

	/**
	 * Block anonymous users only (i.e. disable anonymous edits for this IP address).
	 */
	anononly?: boolean

	/**
	 * Automatically block the last used IP address, and any subsequent IP addresses they try to login from.
	 */
	autoblock?: boolean

	/**
	 * Expiry time. May be relative (e.g. `5 months` or `2 weeks`) or absolute (e.g. `2014-09-18T12:34:56Z`). If set to `infinite`, `indefinite`, or `never`, the block will never expire.
	 * @default `never`
	 */
	expiry?: string

	/**
	 * Prevent account creation.
	 */
	nocreate?: boolean

	/**
	 * Prevent user from sending email through the wiki. (Requires the `blockemail` right).
	 */
	noemail?: boolean

	/**
	 * If the user is already blocked, overwrite the existing block.
	 */
	reblock?: boolean

	/**
	 * Reason for block.
	 */
	reason?: string

	/**
	 * User to block.
	 */
	user: string
}

export interface BlockResponse extends Response {
	block: {
		allowusertalk?: boolean
		anononly?: boolean
		autoblock?: boolean
		expiry: string
		hidename?: boolean
		id: number
		nocreate?: boolean
		noemail?: boolean
		reason: string
		user: string
		userID: number
		watchuser?: boolean
	}
}
