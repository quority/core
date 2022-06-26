import type { MaybeArray, RequireOnlyOneFromThree } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

interface BaseUserContribsRequest extends QueryRequest {
	list: 'usercontribs'

	/**
	 * When more results are available, use this to continue.
	 */
	uccontinue?: string

	/**
	 * In which direction to enumerate.
	 */
	ucdir?: 'newer' | 'older'

	/**
	 * The end timestamp to return to, i.e. revisions after this timestamp.
	 */
	ucend?: string

	/**
	 * The maximum number of contributions to return.
	 */
	uclimit?: number | 'max'

	/**
	 * Only list contributions in these namespaces.
	 */
	ucnamespace?: number | number[]

	/**
	 * Include additional pieces of information.
	 */
	ucprop?: MaybeArray<'ids' | 'title' | 'timestamp' | 'comment' | 'parsedcomment' | 'size' | 'sizediff' | 'flags' | 'patrolled' | 'tags'>

	/**
	 * Show only items that meet these criteria.
	 */
	ucshow?: MaybeArray< '!autopatrolled' | '!minor' | '!new' | '!patrolled' | '!top' | 'autopatrolled' | 'minor' | 'new' | 'patrolled' | 'top' >

	/**
	 * The start timestamp to return from, i.e. revisions before this timestamp.
	 */
	ucstart?: string

	/**
	 * Only list revisions tagged with this tag.
	 */
	uctag?: string

	/**
	 * The users to retrieve contributions for.
	 */
	ucuser: string | string[]

	/**
	 * The user IDs to retrieve contributions for.
	 */
	ucuserids: number | number[]

	/**
	 * Retrieve contributions for all users whose names begin with this value.
	 */
	ucuserprefix: string
}

/**
 * Options for `list=usercontribs`
 */
export type UserContribsRequest = RequireOnlyOneFromThree<BaseUserContribsRequest, 'ucuser', 'ucuserids', 'ucuserprefix'>

export interface UserContribsItem {
	userid: number
	user: string
	pageid: number
	revid: number
	parentid: number
	ns: number
	title: string
	timestamp: string
	comment: string
	size: number
}

export type UserContribsResponse = QueryResponse<
	'uc',
	'usercontribs',
	UserContribsItem
>
