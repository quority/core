import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export class DiscussionVoteController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionVote'

	public async upvote( postId: `${ number }` ): Promise<unknown> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'upVotePost',
			postId
		} )
		const req = await this.raw( url, { method: 'POST' } )
		return req.body.json()
	}

	public async downvote( postId: `${ number }` ): Promise<unknown> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'downVotePost',
			postId
		} )
		const req = await this.raw( url, { method: 'POST' } )
		return req.body.json()
	}
}
