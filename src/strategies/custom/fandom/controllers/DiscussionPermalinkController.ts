import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export class DiscussionPermalinkController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionPermalink'

	public async getThreadByPostId( postId: string ): Promise<unknown> {
		const req = await this.get( {
			method: 'getThreadByPostId',
			postId
		} )
		return req.body.json()
	}
}
