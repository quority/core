import {
	TokenType
} from './utils'

export namespace MediaWikiMetaRequest {
	export interface MetaRequest {
		action: 'query'
	}

	/**
	 * Options for `meta=allmessages`.
	 */
	export interface AllMessages extends MetaRequest {
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

	/**
	 * Options for `meta=filerepoinfo`.
	 */
	export interface FileRepoInfo extends MetaRequest {
		/**
		 * Which repository properties to get (properties available may vary on other wikis). \
		 * \
		 * Available default options: `canUpload`, `descBaseUrl`, `descriptionCacheExpiry`, `displayname`, `favicon`, `fetchDescription`, `initialCapital`, `local`, `name`, `rootUrl`, `scriptDirUrl`, `thumbUrl`, `url`.
		 */
		friprop: string | string[]

		meta: 'filerepoinfo'
	}

	/**
	 * Options for `meta=siteinfo`.
	 */
	export interface SiteInfo extends MetaRequest {
		meta: 'siteinfo'

		/**
		 * Return only local or only nonlocal entries of the interwiki map.
		 */
		sifilteriw?: Array<'local' | '!local'>

		/**
		 * Language code for localised language names (best effort) and skin names.
		 */
		siinlanguagecode?: string

		/**
		 * Lists the number of users in user groups.
		 */
		sinumberingroup?: boolean

		/**
		 * Which information to get.
		 */
		siprop: Array<'general' | 'namespaces' | 'namespacealiases' | 'specialpagealiases' | 'magicwords' | 'interwikimap' | 'dbrepllag' | 'statistics' | 'usergroups' | 'libraries' | 'extensions' | 'fileextensions' | 'rightsinfo' | 'restrictions' | 'languages' | 'languagevariants' | 'skins' | 'extensiontags' | 'functionhooks' | 'showhooks' | 'variables' | 'protocols' | 'defaultoptions' | 'uploaddialog'>

		/**
		 * List all database servers, not just the one lagging the most.
		 */
		sishowalldb?: boolean
	}

	/**
	 * Options for `meta=tokens`.
	 */
	export interface Tokens extends MetaRequest {
		meta: 'tokens'

		/**
		 * Types of token to request.
		 */
		type: TokenType | TokenType[]
	}
}
