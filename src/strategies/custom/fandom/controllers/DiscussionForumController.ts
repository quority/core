import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

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

export interface UpdateForumOrderOptions {
	forumIds: string[]
}

export class DiscussionForumController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionForum'

	public async createForum( options: CreateForumOptions ): Promise<unknown> {
		const req = await this.post( {
			method: 'createForum',
			name: options.name,
			parentId: '1',
			siteId: `${ options.siteId }`
		} )
		return req.body.json()
	}

	public async deleteForum( options: DeleteForumOptions ): Promise<unknown> {
		const req = await this.post( {
			method: 'deleteForum',
			...options
		} )
		return req.body.json()
	}

	public async getForum( forumId: `${ number }` ): Promise<unknown> {
		const req = await this.post( {
			forumId,
			method: 'getForum'
		} )
		return req.body.json()
	}

	public async getForums(): Promise<unknown> {
		const req = await this.get( {
			method: 'getForums'
		} )
		return req.body.json()
	}

	public async moveThreadsIntoForum( options: MoveThreadsOptions ): Promise<unknown> {
		const req = await this.post( {
			method: 'moveThreadsIntoForum',
			...options
		}, 'application/json' )
		return req.body.text()
	}

	public async updateForum( options: UpdateForumOptions ): Promise<unknown> {
		const req = await this.post( {
			method: 'updateForum',
			...options
		} )
		return req.body.json()
	}

	public async updateForumDisplayOrder( options: UpdateForumOrderOptions ): Promise<unknown> {
		const req = await this.post( {
			method: 'updateForumDisplayOrder',
			...options
		} )
		return req.body.json()
	}
}
