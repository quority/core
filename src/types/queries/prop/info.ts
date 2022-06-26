import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=info`
 */
export interface InfoRequest extends QueryRequest {
	prop: 'info'

	/**
	 * When more results are available, use this to continue.
	 */
	incontinue?: string

	/**
	 * The context title to use when determining extra CSS classes (e.g. link colors) when inprop contains linkclasses. Accepts non-existent pages.
	 */
	inlinkcontext?: string

	/**
	 * Which additional properties to get.
	 */
	inprop?: MaybeArray<'protection' | 'talkid' | 'watched' | 'watchers' | 'visitingwatchers' | 'notificationtimestamp' | 'subjectid' | 'associatedpage' | 'url' | 'preload' | 'displaytitle' | 'varianttitles' | 'linkclasses'>

	/**
	 * Test whether the current user can perform certain actions on the page.
	 */
	intestactions?: string | string[]

	/**
	 * Detail level for intestactions.
	 * @default 'boolean'
	 */
	intestactionsdetail?: 'boolean' | 'full' | 'quick'
}

export interface InfoItem {
	pageid: number
	ns: number
	title: string
	contentmodel: string
	pagelanguage: string
	pagelanguagehtmlcode: string
	pagelanguagedir: string
	touched: string
	lastrevid: number
	length: number
	protection: Array<{
		type: string
		level: string
		expiry: string
	}>
	restrictiontypes: string[]
	watched: boolean
	watchers: number
	visitingwatchers: number
	notificationtimestamp: string
	fullurl: string
	editurl: string
	canonicalurl: string
	preload: string
	displaytitle: string
	varianttitles: Record<string, string>
}

export type InfoResponse = QueryResponse<
	'in',
	'pages',
	InfoItem
>
