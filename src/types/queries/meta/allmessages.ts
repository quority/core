import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `meta=allmessages`.
 */
export interface AllMessagesRequest extends QueryRequest {
	/**
	 * Arguments to be substituted into message.
	 */
	amargs?: string | string[]

	/**
	 * Return only messages in this customisation state.
	 * @default 'all'
	 */
	amcustomised?: 'all' | 'modified' | 'unmodified'

	/**
	 * Set to enable parser, will preprocess the wikitext of message (substitute magic words, handle templates, etc.).
	 */
	amenableparser?: boolean

	/**
	 * Return only messages with names that contain this string.
	 */
	amfilter?: string

	/**
	 * Return messages starting at this message.
	 */
	amfrom?: string

	/**
	 * Return messages in this language.
	 */
	amlang?: string

	/**
	 * Which messages to output.
	 * @default '*'
	 */
	ammessages: string | string[]

	/**
	 * Also include local messages, i.e. messages that don't exist in the software but do exist as in the MediaWiki namespace. \
	 * This lists all MediaWiki-namespace pages, so it will also list those that aren't really messages such as Common.js.
	 */
	amincludelocal?: boolean

	/**
	 * If set, do not include the content of the messages in the output.
	 */
	amnocontent?: boolean

	/**
	 * Return messages with this prefix.
	 */
	amprefix?: string

	/**
	 * Page name to use as context when parsing message (for amenableparser option).
	 */
	amtitle?: string

	/**
	 * Return messages ending at this message.
	 */
	amto?: string

	meta: 'allmessages'
}

export type AllMessagesResponse = QueryResponse<
	'am',
	'allmessages',
	{
		name: string
		normalizedname: string
		'*': string
	}
>
