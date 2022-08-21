import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=contributors`
 */
export interface ContributorsRequest extends QueryRequest {
	prop: 'contributors'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	pccontinue?: string

	/**
	 * Exclude users in the given groups. Does not include implicit or auto-promoted groups like *, user, or autoconfirmed.
	 */
	pcexcludegroup?: MaybeArray<string>

	/**
	 * Exclude users having the given rights. Does not include rights granted by implicit or auto-promoted groups like *, user, or autoconfirmed.
	 */
	pcexcluderights?: MaybeArray<string>

	/**
	 * Only include users in the given groups. Does not include implicit or auto-promoted groups like *, user, or autoconfirmed.
	 */
	pcgroup?: MaybeArray<string>

	/**
	 * How many contributors to return.
	 */
	pclimit?: number | 'max'

	/**
	 * Only include users having the given rights. Does not include rights granted by implicit or auto-promoted groups like *, user, or autoconfirmed.
	 */
	pcrights?: MaybeArray<string>
}

export type ContributorsItem = {
	ns: number
	title: string
} & (
	{ missing: true }
	| {
		anoncontributors: number
		contributors: Array<{
			name: string
			userid: number
		}>
		missing?: false
		pageid: number
	}
)

export type ContributorsResponse = QueryResponse<
	'pc',
	'pages',
	ContributorsItem
>
