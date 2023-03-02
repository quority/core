import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export type CreateThreadOptions = {
	articleIds?: Array<`${ number }`>
	attachments?: Record<string, unknown>
	forumId: `${ number }`
	siteId: `${ number }`
	title: string
} & ( {
	body: string
	jsonModel?: never
} | {
	body?: never
	jsonModel: Record<string, unknown>
} )

export type UpdateThreadOptions = Omit<CreateThreadOptions, 'siteId'> & {
	threadId: `${ number }`
}

export class DiscussionThreadController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionThread'

	public async create( { forumId, ...options }: CreateThreadOptions ): Promise<unknown> {
		options.articleIds ??= []
		options.attachments ??= DiscussionThreadController.attachmentsDefault
		const url = new URL( `?controller=${ this.controller }&method=create&forumId=${ forumId }`, this.endpoint.url )
		options.attachments ??= DiscussionThreadController.attachmentsDefault
		const req = await this.raw( url, {
			body: JSON.stringify( {
				...options,
				jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined
			} ),
			method: 'POST'
		} )
		return req.body.json()
	}

	public async delete( threadId: `${ number }` ): Promise<unknown> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'delete',
			threadId
		} )
		const req = await this.raw( url, {
			method: 'POST'
		} )
		return req.body.json()
	}

	public async getThread( threadId: `${ number }` ): Promise<unknown> {
		const req = await this.get( {
			method: 'getThread',
			threadId
		} )
		return req.body.json()
	}

	public async getThreadForAnons( threadId: `${ number }` ): Promise<unknown> {
		const req = await this.get( {
			method: 'getThreadForAnons',
			threadId
		} )
		return req.body.json()
	}

	public async getThreads(): Promise<unknown> {
		const req = await this.get( {
			method: 'getThreads'
		} )
		return req.body.json()
	}

	public async lock( threadId: string ): Promise<unknown> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'lock',
			threadId
		} )
		const req = await this.raw( url, { method: 'POST' } )
		return req.body.json()
	}

	public async undelete( threadId: `${ number }` ): Promise<unknown> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'undelete',
			threadId
		} )
		const req = await this.raw( url, {
			method: 'POST'
		} )
		return req.body.json()
	}

	public async unlock( threadId: string ): Promise<unknown> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'unlock',
			threadId
		} )
		const req = await this.raw( url, { method: 'POST' } )
		return req.statusCode
	}

	public async update( { threadId, ...options }: UpdateThreadOptions ): Promise<unknown> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'update',
			threadId
		} )
		const req = await this.raw( url, {
			body: JSON.stringify( {
				...options,
				jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined
			} ),
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST'
		} )
		return req.body.json()
	}
}
