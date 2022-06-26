export interface Response {
}

export interface QueryResponse<Shortname extends string = string, Name extends string = string, QueryItem = Record<string, unknown>> {
	batchcomplete?: boolean
	continue?: {
		[ key in `${ Shortname }continue` ]: string
	}
	query: {
		/**
		 * Title normalization converts page titles to their canonical form.
		 */
		normalized?: NormalizedInfo[]
		interwiki?: InterwikiInfo[]
		redirects?: RedirectInfo[]

		/**
		 * Can show up if `converttitles` is set to true.
		 */
		converted?: ConvertedInfo[]
	} & {
		[ key in Name ]: QueryItem[]
	}
}

export interface NormalizedInfo extends Record<string, unknown> {
	fromencoded: boolean
	from: string
	to: string
}

export interface InterwikiInfo<Site extends string = string> extends Record<string, unknown> {
	title: `${ Site }:${ string }`
	iw: Site
	/**
	 * Available if `iwurl` is set to true.
	 */
	url?: string
}

export interface RedirectInfo extends Record<string, unknown> {
	from: string
	to: string
	/**
	 * May contain a this attribute for those redirects that point to specific sections.
	 */
	tofragment?: string
}

export interface ConvertedInfo extends Record<string, unknown> {
	from: string
	to: string
}

export interface APIError {
	error: {
		code: string
		info: string
	}
}
