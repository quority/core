import {
	defaults as request
} from 'request'

export class RequestManager {
	private ctx = request( {
		jar: true
	} )
	private url: string

	constructor( {
		url
	}: { url: string } ) {
		this.url = url
	}

	get<T>( {
		url, qs
	}: { url?: string, qs: Record<string, string> } ): Promise<T> {
		return new Promise( resolve => {
			this.ctx.get(
				{
					qs,
					url: url || this.url
				},
				( _error, _res, body ) => {
					resolve( JSON.parse( body ) )
				}
			)
		} )
	}

	post<T>( {
		url, form
	}: { url?: string, form: Record<string, string> } ): Promise<T> {
		return new Promise( resolve => {
			this.ctx.post(
				{
					form,
					url: url || this.url
				},
				( error, res, body ) => {
					resolve( JSON.parse( body ) )
				}
			)
		} )
	}
}
