import type { ActionRequest } from '../Request'
import type { ReadStream } from 'fs'
import type { RequireOnlyOne } from '../utils'

interface BaseUploadRequest extends ActionRequest {
	action: 'upload'

	/**
	 * File contents.
	 */
	file: ReadStream

	/**
	 * Target filename.
	 */
	filename: string

	/**
	 * Ignore any warnings.
	 */
	ignorewarnings?: boolean

	/**
	 * URL to fetch the file from.
	 */
	url: string
}

/**
 * Options to upload a file.
 */
export type UploadRequest = RequireOnlyOne<BaseUploadRequest, 'file', 'url'>

export interface UploadResponse extends Response {
	upload: {
		result: 'Success' | string
		filename?: string
	}
}
