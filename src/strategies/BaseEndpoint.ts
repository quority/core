import type { Wiki } from '../mediawiki'
import type { BaseStrategy } from './BaseStrategy'

export abstract class BaseEndpoint<Strategy extends BaseStrategy = BaseStrategy> {
	public readonly url: URL
	public readonly wiki: Wiki<Strategy>

	public constructor( wiki: Wiki<Strategy>, url: URL ) {
		this.wiki = wiki
		this.url = url
	}
}