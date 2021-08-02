namespace MWRequest {
	interface IEditRequest {
		bot?: boolean
		minor?: boolean
		notminor?: boolean
		recreate?: boolean
		text: string

		title?: string
		pageid?: number
	}
	
	export type Edit = RequireOnlyOne<IEditRequest, 'pageid' | 'title'>
}