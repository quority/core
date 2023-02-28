import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export class DiscussionContributionController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionContribution'

	public async deleteAll( userId: number ): Promise<unknown> {
		const req = await this.post( {
			method: 'deleteAll',
			userId: `${ userId }`
		} )
		return req.body.json()
	}
}
