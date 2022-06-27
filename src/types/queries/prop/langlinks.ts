import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=langlinks`
 */
export interface LangLinksRequest extends QueryRequest {
	prop: 'langlinks'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	llcontinue?: string

	/**
	 * The direction in which to list.
	 */
	lldir?: 'ascending' | 'descending'

	/**
	 * Language code for localised language names.
	 */
	llinlanguagecode?: string

	/**
	 * Only return language links with this language code.
	 */
	lllang?: string

	/**
	 * How many langlinks to return.
	 */
	lllimit?: number | 'max'

	/**
	 * Which additional properties to get for each interlanguage link.
	 */
	llprop?: MaybeArray<'autonym' | 'langname' | 'url'>

	/**
	 * Link to search for. Must be used with `lllang`.
	 */
	lltitle?: string
}

export interface LangLinksItem {
	ns: number
	pageid: number
	title: string
	langlinks: Array<{
		autonym: string
		lang: string
		langname: string
		url: string
		title: string
	}>
}

export type LangLinksResponse = QueryResponse<
	'll',
	'pages',
	LangLinksItem
>
