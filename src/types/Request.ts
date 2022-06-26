export interface Request {

}

export type ActionRequest = Request

export interface AddActionQueryToken {
	action: 'query'
	token?: string
}

export interface QueryRequest extends Request {
	/**
	 * When more results are available, use this to continue.
	 */
	continue?: string

	/**
	 * Convert titles to other variants if necessary. Only works if the wiki's content language supports variant conversion. Languages that support variant conversion include ban, en, crh, gan, iu, kk, ku, shi, sr, tg, uz and zh.
	 */
	converttitles?: boolean

	/**
	 * Export the current revisions of all given or generated pages.
	 */
	export?: boolean

	/**
	 * Return the export XML without wrapping it in an XML result (same format as Special:Export). Can only be used with query+export.
	 */
	exportnowrap?: boolean

	/**
	 * Target the given version of the XML dump format when exporting. Can only be used with query+export.
	 */
	exportschema?: '0.10' | '0.11'

	/**
	 * Include an additional pageids section listing all returned page IDs.
	 */
	indexpageids?: boolean

	/**
	 * Whether to get the full URL if the title is an interwiki link.
	 */
	iwurl?: boolean

	/**
	 * A list of page IDs to work on.
	 */
	pageids?: number | number[]

	/**
	 * Return raw query-continue data for continuation.
	 */
	rawcontinue?: boolean

	/**
	 * Automatically resolve redirects in query+titles, query+pageids, and query+revids, and in pages returned by query+generator.
	 */
	redirects?: boolean

	/**
	 * A list of revision IDs to work on.
	 */
	revids?: number | number[]

	/**
	 * A list of titles to work on.
	 */
	titles?: string | string[]
}

export type JSONRequest<T extends Request> = T & {
	format: 'json'
	formatversion: 2
}

export type NoActionToken<T extends Request> = Omit<T, 'action' | 'token'>

export type RequestParameterType = string | number | boolean | string[] | number[] | undefined
