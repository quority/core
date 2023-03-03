import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export interface CreateWallReplyOptions {
	attachments?: Record<string, unknown>
	jsonModel: Record<string, unknown>
	threadId: `${ number }`
	wallOwnerId: `${ number }`
}

export type CreateWallThreadOptions = Omit<CreateWallReplyOptions, 'threadId'> & {
	title: string
}

export interface DeleteWallReplyOptions {
	postId: `${ number }`
	wallOwnerId: `${ number }`
}

export interface EditWallPostOptions {
	attachments?: Record<string, unknown>
	jsonModel: Record<string, unknown>
	postId: `${ number }`
	threadId: `${ number }`
	title?: string
	wallOwnerId: `${ number }`
}

export class MessageWallController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'MessageWall'

	public async createReply( options: CreateWallReplyOptions ): Promise<unknown> {
		options.attachments ??= MessageWallController.attachmentsDefault
		const req = await this.post( {
			...options,
			attachments: JSON.stringify( options.attachments ),
			controller: this.controller,
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'createReply',
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json()
	}

	public async createThread( options: CreateWallThreadOptions ): Promise<unknown> {
		options.attachments ??= MessageWallController.attachmentsDefault
		const req = await this.post( {
			...options,
			attachments: JSON.stringify( options.attachments ),
			controller: this.controller,
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'createThread',
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json()
	}

	public async deleteReply( options: DeleteWallReplyOptions ): Promise<unknown> {
		const req = await this.post( {
			...options,
			controller: this.controller,
			method: 'deleteReply',
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.statusCode
	}

	public async editPost( options: EditWallPostOptions ): Promise<unknown> {
		options.attachments ??= MessageWallController.attachmentsDefault
		const req = await this.post( {
			...options,
			attachments: JSON.stringify( options.attachments ),
			controller: this.controller,
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'editPost',
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json()
	}

	public async getThread( wallOwnerId: `${ number }`, threadId: `${ number }` ): Promise<unknown> {
		const req = await this.get( {
			method: 'getThread',
			threadId,
			wallOwnerId
		} )
		return req.body.json()
	}

	public async getThreads( wallOwnerId: `${ number }` ): Promise<unknown> {
		const req = await this.get( {
			method: 'getThreads',
			wallOwnerId
		} )
		return req.body.json()
	}

	public async lockThread( wallOwnerId: `${ number }`, threadId: `${ number }` ): Promise<unknown> {
		const req = await this.post( {
			controller: this.controller,
			method: 'lockThread',
			threadId,
			token: await this.endpoint.wiki.platform.getCSRFToken(),
			wallOwnerId
		} )
		return req.body.json()
	}

	public async reportPost( postId: `${ number }` ): Promise<unknown> {
		const req = await this.post( {
			controller: this.controller,
			method: 'reportPost',
			postId,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json()
	}

	public async undeleteReply( options: DeleteWallReplyOptions ): Promise<unknown> {
		const req = await this.post( {
			...options,
			controller: this.controller,
			method: 'undeleteReply',
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.statusCode
	}

	public async unlockThread( wallOwnerId: `${ number }`, threadId: `${ number }` ): Promise<unknown> {
		const req = await this.post( {
			controller: this.controller,
			method: 'unlockThread',
			threadId,
			token: await this.endpoint.wiki.platform.getCSRFToken(),
			wallOwnerId
		} )
		return req.statusCode
	}
}
