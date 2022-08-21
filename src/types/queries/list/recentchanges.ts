import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `list=recentchanges`
 */
export interface RecentChangesRequest extends QueryRequest {
	list: 'recentchanges'

	/**
	 * In which direction to enumerate.
	 */
	rcdir?: 'newer' | 'older'

	/**
	 * The timestamp to end enumerating.
	 */
	rcend?: string

	/**
	 * Don't list changes by this user.
	 */
	rcexcludeuser?: string

	/**
	 * How many total changes to return.
	 */
	rclimit?: number | 'max'

	/**
	 * Filter changes to only these namespaces.
	 */
	rcnamespace?: '*' | number | number[]

	/**
	 * Include additional pieces of information.
	 */
	rcprop?: MaybeArray<'user' | 'userid' | 'comment' | 'flags' | 'timestamp' | 'title' | 'ids' | 'sizes' | 'redirect' | 'patrolled' | 'loginfo' | 'tags' | 'parsedcomment'>

	/**
	 * Show only items that meet these criteria.
	 */
	rcshow?: MaybeArray<'!anon' | '!autropatrolled' | '!bot' | '!minor' | '!patrolled' | '!redirect' | 'anon' | 'autopatrolled' | 'bot' | 'minor' | 'patrolled' | 'redirect' | 'unpatrolled'>

	/**
	 * The timestamp to start enumerating from.
	 */
	rcstart?: string

	/**
	 * Only list changes by this user.
	 */
	rcuser?: string

	/**
	 * Filter entries to those related to a page.
	 */
	rctitle?: string

	/**
	 * Only list changes which are the latest revision.
	 */
	rctoponly?: boolean

	/**
	 * Which types of changes to show.
	 */
	rctype?: MaybeArray<'edit' | 'new' | 'log' | 'categorize'>
}

export interface RecentChangesItem {
	type: string
	ns: number
	title: string
	pageid: number
	revid: number
	old_revid: number
	rcid: number
	user: string
	oldlen: number
	newlen: number
}

export type RecentChangesResponse = QueryResponse<
	'rc',
	'recentchanges',
	RecentChangesItem
>
