import {
	RequireOnlyOne
} from './utils'
import fs from 'fs'

export namespace MWRequests {
	interface IDeleteRequest {
		reason?: string
		token: string

		pageid?: number
		title?: string
	}

	export type Delete = RequireOnlyOne<IDeleteRequest, 'pageid' | 'title'>

	interface IEditRequest {
		bot?: boolean
		minor?: boolean
		notminor?: boolean
		recreate?: boolean
		text: string

		title?: string
		pageid?: number
	}

	export type Edit = RequireOnlyOne<IEditRequest, 'pageid' | 'title'>

	export interface Login {
		action: 'login'
		lgname: string
		lgpassword: string
		lgtoken: string
	}

	export type Upload = {
		action: 'upload'
		filename: string
		ignorewarnings?: 1
		token: string
	} & ( {
		file: fs.ReadStream
	} | {
		url: string
	} )
}
