import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=extlinks`
 */
export interface ExtLinksRequest extends QueryRequest {
	prop: 'extlinks'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	elcontinue?: string

	/**
	 * Expand protocol-relative URLs with the canonical protocol.
	 */
	elexpandurl?: boolean

	/**
	 * Limit how many revisions will be returned.
	 */
	ellimit?: number | 'max'

	/**
	 * Protocol of the URL. If empty and elquery is set, the protocol is http. Leave both this and elquery empty to list all external links.
	 */
	elprotocol?: MaybeArray<'' | 'bitcoin' | 'ftp' | 'ftps' | 'geo' | 'git' | 'gopher' | 'http' | 'https' | 'irc' | 'ircs' | 'magnet' | 'mailto' | 'mms' | 'news' | 'nntp' | 'redis' | 'sftp' | 'sip' | 'sips' | 'sms' | 'ssh' | 'svn' | 'tel' | 'telnet' | 'urn' | 'worldwind' | 'xmpp'>

	/**
	 * Search string without protocol. Useful for checking whether a certain page contains a certain external url.
	 */
	elquery?: string
}

export interface ExtLinksItem {
	extlinks?: Array<{
		url: string
	}>
	ns: number
	pageid: number
	title: string
}

export type ExtLinksResponse = QueryResponse<
	'el',
	'pages',
	ExtLinksItem
>
