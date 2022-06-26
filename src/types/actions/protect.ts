import type { MaybeArray, RequireOnlyOne } from '../utils'
import type { ActionRequest } from '../Request'

export type ProtectionAction = 'edit' | 'move'
export type ProtectionLevel = 'all' | 'autoconfirmed' | 'sysop'

interface BaseProtectRequest<Action extends string = ProtectionAction, Level extends string = ProtectionLevel> extends ActionRequest {
	action: 'protect'

	/**
	 * Enable cascading protection (i.e. protect transcluded templates and images used in this page). Ignored if none of the given protection levels support cascading.
	 */
	cascade?: boolean

	/**
	 * Expiry timestamps. If only one timestamp is set, it'll be used for all protections. Use infinite, `indefinite`, `infinity`, or `never`, for a never-expiring protection.
	 */
	expiry?: string

	/**
	 * ID of the page to (un)protect.
	 */
	pageid: number

	/**
	 * List of protection levels, formatted `action=level` (e.g. `edit=sysop`). A level of all means everyone is allowed to take the action, i.e. no restriction.
	 * Note: Any actions not listed will have restrictions removed.
	 */
	protections: MaybeArray<`${ Action }=${ Level }`> | ''

	/**
	 * Reason for (un)protecting.
	 */
	reason?: string

	/**
	 * Title of the page to (un)protect. Cannot be used together with pageid.
	 */
	title: string
}

/**
 * Options to protect a page.
 */
export type ProtectRequest<Action extends string = ProtectionAction, Level extends string = ProtectionLevel> = RequireOnlyOne<BaseProtectRequest<Action, Level>, 'title', 'pageid'>

export interface ProtectResponse extends Response {
	protect: {
		protections: string[]
		reason: string
		title: string
	}
}
