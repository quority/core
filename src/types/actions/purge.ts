import type { ActionRequest } from '../Request'
import type { RequireOnlyOneFromThree } from '../utils'

interface BasePurgeRequest extends ActionRequest {
	action: 'purge'

	/**
	 * When more results are available, use this to continue.
	 */
	continue?: string

	/**
	 * Convert titles to other variants if necessary. Only works if the wiki's content language supports variant conversion. Languages that support variant conversion include ban, en, crh, gan, iu, kk, ku, shi, sr, tg, uz and zh.
	 */
	converttitles?: boolean

	/**
	 * Update the links tables and do other secondary data updates.
	 */
	forcelinkupdate?: boolean

	/**
	 * Same as `forcelinkupdate`, and update the links tables for any page that uses this page as a template.
	 */
	forcerecursivelinkupdate?: boolean

	/**
	 * A list of page IDs to work on.
	 */
	pageids: number | number[]

	/**
	 * Automatically resolve redirects.
	 */
	redirects?: boolean

	/**
	 * A list of revision IDs to work on.
	 */
	revids: number | number[]

	/**
	 * A list of titles to work on.
	 */
	titles: string | string[]
}

/**
 * Options to purge the cache for the given titles.
 */
export type PurgeRequest = RequireOnlyOneFromThree<BasePurgeRequest, 'pageids', 'revids', 'titles'>

export interface PurgeResponse extends Response {
	purge: Array<{
		ns: number
		title: string
	} & (
		{
			missing: string
		} | {
			purged: string
		}
	)>
}
