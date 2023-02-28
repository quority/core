import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export class DiscussionLeaderboardController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionLeaderboard'

	public async getModeratorActions(): Promise<unknown> {
		const req = await this.get( {
			method: 'getModeratorActions'
		} )
		return req.body.json()
	}

	public async getPosts(): Promise<unknown> {
		const req = await this.get( {
			method: 'getPosts'
		} )
		return req.body.json()
	}

	public async getReports(): Promise<unknown> {
		const req = await this.get( {
			method: 'getReports'
		} )
		return req.body.json()
	}
}
