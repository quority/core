import type { RequestManager } from '../../../../utils'
import type { Fandom } from '../../../FandomStrategy'
import type { BaseEndpoint } from '../../BaseEndpoint'

export class BaseController<Endpoint extends BaseEndpoint<Fandom>> {
	public readonly endpoint: Endpoint
	public readonly request: RequestManager

	public constructor( endpoint: Endpoint ) {
		this.endpoint = endpoint
		this.request = endpoint.wiki.request
	}
}
