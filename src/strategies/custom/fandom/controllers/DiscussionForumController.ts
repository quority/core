import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'
import type { DiscussionForumBody, DiscussionForums } from './types'

export interface CreateForumOptions {
	name: string
	siteId: number
}

export interface DeleteForumOptions {
	forumId: string
	moveChildrenTo: string
}

export interface MoveThreadsOptions {
	forumId: string
	threadIds: string[]
}

export interface UpdateForumOptions {
	forumId: string
	name: string
}

export class DiscussionForumController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionForum'

	public async createForum( options: CreateForumOptions ): Promise<DiscussionForumBody> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'createForum'
		} )
		const req = await this.raw( url, {
			body: JSON.stringify( {
				name: options.name,
				parentId: '1',
				siteId: `${ options.siteId }`
			} ),
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST'
		} )
		return req.body.json() as Promise<DiscussionForumBody>
	}

	public async deleteForum( { forumId, moveChildrenTo }: DeleteForumOptions ): Promise<boolean> {
		const url = this.getUrl( {
			controller: this.controller,
			forumId,
			method: 'deleteForum'
		} )
		const req = await this.raw( url, {
			body: JSON.stringify( { moveChildrenTo } ),
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST'
		} )
		return req.statusCode === 204
	}

	public async getForum( forumId: `${ number }` ): Promise<DiscussionForumBody> {
		const req = await this.get( {
			forumId,
			method: 'getForum'
		} )
		return req.body.json() as Promise<DiscussionForumBody>
	}

	public async getForums(): Promise<DiscussionForums> {
		const req = await this.get( {
			method: 'getForums'
		} )
		return req.body.json() as Promise<DiscussionForums>
	}

	public async moveThreadsIntoForum( { forumId, threadIds }: MoveThreadsOptions ): Promise<boolean> {
		const url = this.getUrl( {
			controller: this.controller,
			forumId,
			method: 'moveThreadsIntoForum'
		} )
		const req = await this.raw( url, {
			body: JSON.stringify( { threadIds } ),
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST'
		} )
		return req.statusCode === 204
	}

	public async updateForum( { forumId, name }: UpdateForumOptions ): Promise<DiscussionForumBody> {
		const url = this.getUrl( {
			controller: this.controller,
			forumId,
			method: 'updateForum'
		} )
		const req = await this.raw( url, {
			body: JSON.stringify( { name } ),
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST'
		} )
		return req.body.json() as Promise<DiscussionForumBody>
	}

	public async updateForumDisplayOrder( forumIds: string[] ): Promise<{ forumIds: Array<`${ number }`> }> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'updateForumDisplayOrder'
		} )
		const req = await this.raw( url, {
			body: JSON.stringify( { forumIds } ),
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST'
		} )
		return req.body.json() as Promise<{ forumIds: Array<`${ number }`> }>
	}
}
