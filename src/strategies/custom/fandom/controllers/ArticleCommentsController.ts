import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export class ArticleCommentsController extends BaseController<WikiaEndpoint> {
	public async deletePost( postId: string ): Promise<void> {
		await this.request.raw(
			this.endpoint.url,
			{
				body: new URLSearchParams( {
					controller: 'ArticleComments',
					method: 'deletePost',
					postId,
					token: await this.endpoint.wiki.platform.getCSRFToken()
				} ).toString(),
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				method: 'POST'
			},
			{
				cookieUrl: this.endpoint.wiki.platform.services
			}
		)
	}
}
