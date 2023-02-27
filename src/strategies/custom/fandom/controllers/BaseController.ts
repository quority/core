import type { Dispatcher } from 'undici'
import type { RequestManager } from '../../../../utils'
import type { Fandom } from '../../../FandomStrategy'
import type { BaseEndpoint } from '../../BaseEndpoint'

export abstract class BaseController<Endpoint extends BaseEndpoint<Fandom>> {
	public abstract readonly controller: string
	public readonly endpoint: Endpoint
	public readonly request: RequestManager

	public constructor( endpoint: Endpoint ) {
		this.endpoint = endpoint
		this.request = endpoint.wiki.request
	}

	protected get( searchParams: Record<string, string> ): Promise<Dispatcher.ResponseData> {
		const usp = new URLSearchParams( {
			controller: 'ArticleComments',
			...searchParams
		} ).toString()
		const url = new URL( `?${ usp }`, this.endpoint.url )
		return this.raw( url, {
			method: 'GET'
		} )
	}

	protected post( body: Record<string, string> ): Promise<Dispatcher.ResponseData> {
		return this.raw( this.endpoint.url, {
			body: new URLSearchParams( {
				controller: 'ArticleComments',
				...body
			} ).toString(),
			method: 'POST'
		} )
	}

	protected raw( url: string | URL, fetchOptions: Omit<Dispatcher.RequestOptions, 'path'> ): Promise<Dispatcher.ResponseData> {
		return this.request.raw(
			url,
			{
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				...fetchOptions
			},
			{ cookieUrl: this.endpoint.wiki.platform.services }
		)
	}
}
