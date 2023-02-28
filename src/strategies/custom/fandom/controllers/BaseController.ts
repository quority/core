import { type Dispatcher, FormData } from 'undici'
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

	protected post( body: FormData, contentType?: 'multipart/form-data' ): Promise<Dispatcher.ResponseData>
	protected post( body: Record<string, unknown>, contentType?: 'application/json' ): Promise<Dispatcher.ResponseData>
	protected post( body: Record<string, string>, contentType?: string ): Promise<Dispatcher.ResponseData>
	protected post( body: Record<string, string> | Record<string, unknown> | FormData, contentType?: string ): Promise<Dispatcher.ResponseData> {
		let requestBody: string | FormData
		const headers: Record<string, string | undefined> = {
			'content-type': contentType ?? 'application/x-www-form-urlencoded'
		}

		if ( contentType === 'application/json' ) {
			requestBody = JSON.stringify( body )
		} else if ( contentType === 'multipart/form-data' && body instanceof FormData ) {
			headers[ 'content-type' ] = undefined
			requestBody = body
		} else {
			requestBody = new URLSearchParams( body as Record<string, string> ).toString()
		}

		return this.raw( this.endpoint.url, {
			body: requestBody,
			headers,
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