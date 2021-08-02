namespace MWRequest {
	interface IDeleteRequest {
		reason?: string
		token: string
	
		pageid?: number
		title?: string
	}
	
	export type Delete = RequireOnlyOne<IDeleteRequest, 'pageid' | 'title'>
}