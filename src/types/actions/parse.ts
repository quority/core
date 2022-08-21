import type { ActionRequest } from '../Request'
import type { MaybeArray } from '../utils'

/**
 * Parses content and returns parser output.
 */
export interface ParseRequest extends ActionRequest {
	action: 'parse'

	/**
	 * Content serialization format used for the input text. Only valid when used with `text`.
	 */
	contentformat?: 'application/json' | 'application/octet-stream' | 'application/unknown' | 'application/x-binary' | 'text/css' | 'text/javascript' | 'text/plain' | 'text/unknown' | 'text/x-wiki' | 'unknown/unknown'

	/**
	 * Content model of the input text. If omitted, title must be specified, and default will be the model of the specified title. Only valid when used with `text`.
	 */
	contentmodel?: 'GadgetDefinition' | 'Json.JsonConfig' | 'JsonSchema' | 'Map.JsonConfig' | 'MassMessageListContent' | 'NewsletterContent' | 'Scribunto' | 'SecurePoll' | 'Tabular.JsonConfig' | 'css' | 'flow-board' | 'javascript' | 'json' | 'sanitized-css' | 'text' | 'translate-messagebundle' | 'unknown' | 'wikitext'

	/**
	 * Omit edit section links from the parser output.
	 */
	disableeditsection?: boolean

	/**
	 * Omit the limit report ("NewPP limit report") from the parser output.
	 */
	disablelimitreport?: boolean

	/**
	 * Do not deduplicate inline stylesheets in the parser output.
	 */
	disablestylededuplication?: boolean

	/**
	 * Omit table of contents in output.
	 */
	disabletoc?: boolean

	/**
	 * Apply mobile main page transformations.
	 */
	mainpage?: boolean

	/**
	 * Return parse output in a format suitable for mobile devices.
	 */
	mobileformat?: boolean

	/**
	 * Parse the content of this revision. Overrides `page` and `pageid`.
	 */
	oldid?: number

	/**
	 * Do a pre-save transform (PST) on the input, but don't parse it. Returns the same wikitext, after a PST has been applied. Only valid when used with `text`.
	 */
	onlypst?: boolean

	/**
	 * Parse the content of this page. Cannot be used together with `text` and `title`.
	 */
	page?: string

	/**
	 * Parse the content of this page. Overrides `page`.
	 */
	pageid?: number

	/**
	 * Parse in preview mode.
	 */
	preview?: boolean

	/**
	 * Which pieces of information to get.
	 */
	prop?: MaybeArray<'text' | 'langlinks' | 'categories' | 'categorieshtml' | 'links' | 'templates' | 'images' | 'externallinks' | 'sections' | 'revid' | 'displaytitle' | 'subtitle' | 'headhtml' | 'modules' | 'jsconfigvars' | 'encodedjsconfigvars' | 'indicators' | 'iwlinks' | 'wikitext' | 'properties' | 'limitreportdata' | 'limitreporthtml' | 'parsetree' | 'parsewarnings' | 'parsewarningshtml'>

	/**
	 * Do a pre-save transform on the input before parsing it. Only valid when used with `text`.
	 */
	pst?: boolean

	/**
	 * If `page` or `pageid` is set to a redirect, resolve it.
	 */
	redirects?: boolean

	/**
	 * Revision ID, for `{{REVISIONID}}` and similar variables.
	 */
	revid?: number

	/**
	 * Only parse the content of this section number.
	 */
	section?: number | 'new'

	/**
	 * Parse in section preview mode (enables preview mode too).
	 */
	sectionpreview?: boolean

	/**
	 * New section title when `section` is `new`.
	 */
	sectiontitle?: string

	/**
	 * Summary to parse.
	 */
	summary?: string

	/**
	 * Content format of `templatesandboxtext`.
	 */
	templatesandboxcontentformat?: 'application/json' | 'application/octet-stream' | 'application/unknown' | 'application/x-binary' | 'text/css' | 'text/javascript' | 'text/plain' | 'text/unknown' | 'text/x-wiki' | 'unknown/unknown'

	/**
	 * Content model of `templatesandboxtext`.
	 */
	templatesandboxcontentmodel?: 'GadgetDefinition' | 'Json.JsonConfig' | 'JsonSchema' | 'Map.JsonConfig' | 'MassMessageListContent' | 'NewsletterContent' | 'Scribunto' | 'SecurePoll' | 'Tabular.JsonConfig' | 'css' | 'flow-board' | 'javascript' | 'json' | 'sanitized-css' | 'text' | 'translate-messagebundle' | 'unknown' | 'wikitext'

	/**
	 * Template sandbox prefix, as with Special:TemplateSandbox.
	 */
	templatesanboxprefix?: string | string[]

	/**
	 * Parse the page using this page content in place of the page named by `templatesandboxtitle`.
	 */
	templatesandboxtext?: string

	/**
	 * Parse the page using `templatesandboxtext` in place of the contents of the page named here.
	 */
	templatesandboxtitle?: string

	/**
	 * Text to parse. Use `title` or `contentmodel` to control the content model.
	 */
	text?: string

	/**
	 * Title of page the text belongs to. If omitted, `contentmodel` must be specified, and "API" will be used as the title.
	 */
	title?: string

	/**
	 * Apply the selected skin to the parser output. May affect the following properties: `langlinks`, `headitems`, `modules`, `jsconfigvars`, `indicators`.
	 */
	useskin?: string

	/**
	 * CSS class to use to wrap the parser output.
	 * @default 'mw-parser-output'
	 */
	wrapoutputclass?: string
}

export interface ParseResponse extends Response {
	parse: {
		title: string
		pageid: number
		revid: number
		text: string
		langlinks: Array<{
			lang: string
			url: string
			langname: string
			autonym: string
			title: string
		}>
		categories: Array<{
			sortkey: string
			category: string
			hidden?: boolean
		}>
		links: Array<{
			ns: number
			title: string
			exists: boolean
		}>
		templates: Array<{
			ns: number
			title: string
			exists: boolean
		}>
		images: string[]
		externallinks: string[]
		sections: Array<{
			toclevel: number
			level: string
			line: string
			number: string
			index: string
			fromtitle: string
			byteoffset: number
			anchor: string
		}>
		displaytitle: string
		iwlinks: Array<{
			prefix: string
			url: string
			title: string
		}>
		properties: Record<string, string>
	}
}
