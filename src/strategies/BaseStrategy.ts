import type { Wiki } from '../mediawiki'
import type { BaseEndpoint } from './BaseEndpoint'

export class BaseStrategy {
	public static readonly cookieRegexes: RegExp[] = []
	public csrf: string | null = null
	public readonly custom: Record<string, BaseEndpoint> | null = null
	public readonly wiki: Wiki<BaseStrategy>

	public constructor( wiki: Wiki<BaseStrategy> ) {
		this.wiki = wiki
	}

	public static getApi( api: string ): URL {
		return new URL( api )
	}
}
