import {
	defaults as request,
	Response
} from 'request'

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
	}: { url: string, form: Record<string, string> } ): Promise<T> {
		return new Promise( resolve => {
			this.ctx.post(
				{
					form,
					url
				},
				( _error, _res, body ) => {
					resolve( JSON.parse( body ) )
				}
			)
		} )
	}

	raw( url: string ): Promise<Response> {
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
