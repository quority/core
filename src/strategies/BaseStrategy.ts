import type { Wiki } from '../mediawiki'

export class BaseStrategy {
	public readonly wiki: Wiki<BaseStrategy>

	public constructor( wiki: Wiki<BaseStrategy> ) {
		this.wiki = wiki
	}

	public getApi( api: string ): URL {
		return new URL( api )
	}
}
