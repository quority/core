import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'
import type { DiscussionLeaderboard, DiscussionReportLeaderboard } from './types'

export class DiscussionLeaderboardController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionLeaderboard'

	public async getModeratorActions(): Promise<DiscussionLeaderboard> {
		const req = await this.get( {
			method: 'getModeratorActions'
		} )
		return req.body.json() as Promise<DiscussionLeaderboard>
	}

	public async getPosts(): Promise<DiscussionLeaderboard> {
		const req = await this.get( {
			method: 'getPosts'
		} )
		return req.body.json() as Promise<DiscussionLeaderboard>
	}

	public async getReports(): Promise<DiscussionReportLeaderboard> {
		const req = await this.get( {
			method: 'getReports'
		} )
		return req.body.json() as Promise<DiscussionReportLeaderboard>
	}
}
