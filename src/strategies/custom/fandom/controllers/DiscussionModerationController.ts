import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export interface ValidatePostReportOptions {
	containerType: string
	postId: string
}

export class DiscussionModerationController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionModeration'

	public async getPostListReports( postId: string ): Promise<unknown> {
		const req = await this.get( {
			method: 'getPostListReports',
			postId
		} )
		return req.body.json()
	}

	public async getReportedPosts(): Promise<unknown> {
		const req = await this.get( {
			method: 'getReportedPosts'
		} )
		return req.body.json()
	}

	public async reportPost( postId: string ): Promise<unknown> {
		const req = await this.post( {
			method: 'reportPost',
			postId
		} )
		return req.body.json()
	}

	public async validatePostReport( options: ValidatePostReportOptions ): Promise<unknown> {
		const req = await this.post( {
			method: 'validatePostReport',
			...options
		} )
		return req.body.json()
	}
}
