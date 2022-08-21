import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

/**
 * Options for `meta=filerepoinfo`.
 */
export interface FileRepoInfoRequest extends QueryRequest {
	/**
	 * Which repository properties to get (properties available may vary on other wikis). \
	 * \
	 * Available default options: `canUpload`, `descBaseUrl`, `descriptionCacheExpiry`, `displayname`, `favicon`, `fetchDescription`, `initialCapital`, `local`, `name`, `rootUrl`, `scriptDirUrl`, `thumbUrl`, `url`.
	 */
	friprop: string | string[]

	meta: 'filerepoinfo'
}

export type FileRepoInfoResponse = QueryResponse<
	'am',
	'repos',
	{
		displayname: string
		name: string
		url: string
	}
>
