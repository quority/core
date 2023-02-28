import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export class DiscussionPollController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionPoll'

	public async getVoters( pollId: string ): Promise<unknown> {
		const req = await this.get( {
			method: 'getVoters',
			pollId
		} )
		return req.body.json()
	}
}
