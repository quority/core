import {
	RequireOnlyOne
} from './utils'
import fs from 'fs'

export namespace MWRequests {
	export interface Block {
		user: string
		expiry: string
		reason?: string
		anononly?: boolean
		nocreate?: boolean
		autoblock?: boolean
		noemail?: boolean
		allowusertalk?: boolean
		reblock?: boolean
	}

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

	export type Move = {
		from: string
		to: string
		reason?: string
		movetalk?: boolean
		movesubpages?: boolean
		noredirect?: boolean
		ignorewarnings?: boolean
	}

	type ProtectionAction = 'edit' | 'move'
	type ProtectionLevel = 'all' | 'autoconfirmed' | 'sysop'
	interface IProtectRequest {
		protections: Array<`${ProtectionAction}=${ProtectionLevel}`> | ''
		expiry?: string
		reason?: string
		cascade?: boolean

		title?: string
		pageid?: number
	}
	export type Protect = RequireOnlyOne<IProtectRequest, 'title' | 'pageid'>

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
