import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export type CreateReplyOptions = {
	attachments?: Record<string, unknown>
	siteId: `${ number }`
	threadId: `${ number }`
} & ( {
	body: string
	jsonModel?: never
} | {
	body?: never
	jsonModel: Record<string, unknown>
} )

export class DiscussionPostController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionPost'

	public async create( options: CreateReplyOptions ): Promise<unknown> {
		options.attachments ??= DiscussionPostController.attachmentsDefault
		const req = await this.post( {
			...options,
			jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined,
			method: 'create'
		}, 'application/json' )
		return req.body.json()
	}

	public async delete( postId: `${ number }` ): Promise<unknown> {
		const req = await this.post( {
			controller: this.controller,
			method: 'delete',
			postId
		} )
		return req.body.json()
	}

	public async getPost( postId: `${ number }` ): Promise<unknown> {
		const req = await this.get( {
			method: 'getPost',
			postId
		} )
		return req.body.json()
	}

	public async getPosts(): Promise<unknown> {
		const req = await this.get( {
			method: 'getPosts'
		} )
		return req.body.json()
	}

	public async undelete( postId: `${ number }` ): Promise<unknown> {
		const req = await this.post( {
			controller: this.controller,
			method: 'undelete',
			postId
		} )
		return req.body.json()
	}

	public async update( postId: `${ number }`, options: Omit<CreateReplyOptions, 'siteId'> ): Promise<unknown> {
		const url = new URL( `?controller=${ this.controller }&method=update&postId=${ postId }`, this.endpoint.url )
		options.attachments ??= DiscussionPostController.attachmentsDefault
		const req = await this.raw( url, {
			body: JSON.stringify( {
				...options,
				jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined
			} ),
			method: 'POST'
		} )
		return req.body.json()
	}
}
