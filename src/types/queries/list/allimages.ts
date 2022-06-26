import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `list=allimages`
 */
export interface AllImagesRequest extends QueryRequest {
	/**
	 * When more results are available, use this to continue.
	 */
	aicontinue?: string

	/**
	 * The direction in which to list.
	 */
	aidir?: 'ascending' | 'descending' | 'newer' | 'older'

	/**
	 * The timestamp to end enumerating. Can only be used with aisort=timestamp.
	 */
	aiend?: string

	/**
	 * How to filter files uploaded by bots. Can only be used with `aisort=timestamp`. Cannot be used together with `aiuser`.
	 */
	aifilterbots?: 'all' | 'bots' | 'nobots'

	/**
	 * The image title to start enumerating from. Can only be used with `aisort=name`.
	 */
	aifrom?: string

	/**
	 * How many images in total to return.
	 */
	ailimit?: number | 'max'

	/**
	 * Limit to images with at most this many bytes.
	 */
	aimaxsize?: number

	/**
	 * Limit to images with at least this many bytes.
	 */
	aiminsize?: number

	/**
	 * Search for all image titles that begin with this value. Can only be used with `aisort=name`.
	 */
	aiprefix?: string

	/**
	 * Which file information to get.
	 */
	aiprop?: MaybeArray<'timestamp' | 'user' | 'userid' | 'comment' | 'parsedcomment' | 'canonicaltitle' | 'url' | 'size' | 'dimensions' | 'sha1' | 'mime' | 'mediatype' | 'metadata' | 'commonmetadata' | 'extmetadata' | 'bitdepth' | 'badfile'>

	/**
	 * Property to sort by.
	 */
	aisort?: 'name' | 'timestamp'

	/**
	 * The timestamp to start enumerating from. Can only be used with `aisort=timestamp`.
	 */
	aistart?: string

	/**
	 * Only return files uploaded by this user. Can only be used with `aisort=timestamp`. Cannot be used together with `aifilterbots`.
	 */
	aiuser?: string

	list: 'allimages'
}

export interface AllImagesItem {
	name: string
	timestamp: string
	url: string
	descriptionurl: string
	descriptionshorturl: string
	ns: number
	title: string
}

export type AllImagesResponse = QueryResponse<
	'ai',
	'allimages',
	AllImagesItem
>
