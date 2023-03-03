import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export class FeedsAndPostsController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'FeedsAndPosts'

	public async getArticleNamesAndUsernames( stablePageIds: Array<string | number> ): Promise<unknown> {
		const req = await this.get( {
			method: 'getArticleNamesAndUsernames',
			stablePageIds: stablePageIds.join( ',' )
		} )
		return req.body.json()
	}

	public async getPopularTags(): Promise<unknown> {
		const req = await this.get( {
			method: 'getPopularTags'
		} )
		return req.body.json()
	}

	public async searchForTags( query: string ): Promise<unknown> {
		const req = await this.get( {
			method: 'searchForTags',
			query
		} )
		return req.body.json()
	}
}
