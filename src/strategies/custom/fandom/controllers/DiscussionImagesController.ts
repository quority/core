import type fs from 'fs'
import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'
import { FormData } from 'undici'

export class DiscussionImagesController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionImages'

	public async uploadImage( image: fs.ReadStream ): Promise<unknown> {
		const form = new FormData()
		form.append( 'method', 'uploadImage' )
		form.append( 'data', image )
		form.append( 'context', 'discussions' )

		const req = await this.post( form, 'multipart/form-data' )
		return req.body.json()
	}
}
