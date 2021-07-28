import {
	Response as RequestResponse,
	defaults as request
} from 'request'
import fs from 'fs'

export class RequestManager {
	private ctx = request( {
		jar: true
	} )

	get<T>( {
		url, qs
	}: { url: string, qs: Record<string, string> } ): Promise<T> {
		return new Promise( resolve => {
			this.ctx.get(
				{
					qs,
					url
				},
				( _error, _res, body ) => {
					resolve( JSON.parse( body ) )
				}
			)
		} )
	}

	post<T>( {
		url, form
	}: { url: string, form: Record<string, string | fs.ReadStream> } ): Promise<T> {
		return new Promise( resolve => {
			const findReadStream = Object.values( form )
				.find( i => i instanceof fs.ReadStream )
			const hasReadStream = findReadStream !== undefined

			const key = hasReadStream ? 'formData' : 'form'

			const params = {
				[ key ]: form,
				url
			}

			this.ctx.post(
				params,
				( _error, _res, body ) => {
					resolve( JSON.parse( body ) )
				}
			)
		} )
	}

	raw( url: string ): Promise<RequestResponse> {
		return new Promise( resolve => {
			this.ctx.get(
				{
					url
				},
				( _error, res ) => {
					resolve( res )
				}
			)
		} )
	}
}
