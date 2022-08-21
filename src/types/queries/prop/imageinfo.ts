import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `prop=imageinfo`
 */
export interface ImageInfoRequest extends QueryRequest {
	prop: 'imageinfo'

	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	iicontinue?: string

	/**
	 * Timestamp to stop listing at.
	 */
	iiend?: string

	/**
	 * If specified and non-empty, only these keys will be returned for `iiprop=extmetadata`.
	 */
	iiextmetadatafilter?: MaybeArray<string>

	/**
	 * What language to fetch extmetadata in. This affects both which translation to fetch, if multiple are available, as well as how things like numbers and various values are formatted.
	 */
	iiextmetadatalanguage?: string

	/**
	 * If translations for extmetadata property are available, fetch all of them.
	 */
	iiextmetadatamultilang?: boolean

	/**
	 * Limit how many revisions will be returned.
	 */
	iilimit?: number | 'max'

	/**
	 * Look only for files in the local repository.
	 */
	iilocalonly?: boolean

	/**
	 * Version of metadata to use. If latest is specified, use latest version. Defaults to `1` for backwards compatibility.
	 */
	iimetadataversion?: number

	/**
	 * Which file information to get.
	 */
	iiprop?: MaybeArray<'timestamp' | 'user' | 'userid' | 'comment' | 'parsedcomment' | 'canonicaltitle' | 'url' | 'size' | 'dimensions' | 'sha1' | 'mime' | 'thumbmime' | 'mediatype' | 'metadata' | 'commonmetadata' | 'extmetadata' | 'archivename' | 'bitdepth' | 'uploadwarning' | 'badfile'>

	/**
	 * Timestamp to start listing from.
	 */
	iistart?: string

	/**
	 * Similar to `iiurlwidth`.
	 */
	iiurlheight?: number

	/**
	 * A handler specific parameter string. For example, PDFs might use page15-100px. `iiurlwidth` must be used and be consistent with `iiurlparam`.
	 */
	iiurlparam?: string

	/**
	 * If iiprop=url is set, a URL to an image scaled to this width will be returned.
		For performance reasons if this option is used, no more than 50 scaled images will be returned.
	 */
	iiurlwidth?: number
}

export interface ImageInfoItem {
	imageinfo: Array<{
		canonicaltitle: string
		comment: string
		commonmetadata: Array<{
			name: string
			value: unknown
		}>
		descriptionshorturl: string
		descriptionurl: string
		extmetadata: {
			DateTime: {
				hidden: string
				source: string
				value: string
			}
			ObjectName: {
				hidden: string
				source: string
				value: string
			}
			bitdepth: number
			mediatype: string
			mime: string
		}
		height: number
		html: string
		metadata: Array<{
			name: string
			value: unknown
		}>
		parsedcomment: string
		sha1: string
		size: number
		timestamp: string
		url: string
		user: string
		userid: number
		width: number
	}>
	ns: number
	pageid: number
	title: string
}

export type ImageInfoResponse = QueryResponse<
	'ii',
	'pages',
	ImageInfoItem
>
