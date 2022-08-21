import type { MaybeArray, RequireOnlyOne } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

interface BaseUsersRequest extends QueryRequest {
	list: 'users'

	/**
	 * Which pieces of information to include.
	 */
	usprop?: MaybeArray<'blockinfo' | 'groups' | 'groupmemberships' | 'implicitgroups' | 'rights' | 'editcount' | 'registration' | 'emailable' | 'gender' | 'centralids' | 'cancreate'>

	/**
	 * A list of users to obtain information for.
	 */
	ususers: string | string[]

	/**
	 * A list of user IDs to obtain information for.
	 */
	ususerids: number | number[]
}

/**
 * Options for `list=users`
 */
export type UsersRequest = RequireOnlyOne<BaseUsersRequest, 'ususers', 'ususerids'>

export interface UsersItem {
	userid: number
	name: string
	groups: string[]
	rights: string[]
}

export type UsersResponse = QueryResponse<
	'us',
	'users',
	UsersItem
>
