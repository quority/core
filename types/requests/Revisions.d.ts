interface IApiRevisionsRequest {
	rvprop?: Array<'ids' | 'flags' | 'timestamp' | 'user' | 'userid' | 'size' | 'slotsize' | 'sha1' | 'slotsha1' | 'contentmodel' | 'comment' | 'parsedcomment' | 'content' | 'tags' | 'roles'>
	rvslots?: 'main'
	rvlimit?: number | 'max'
	rvstart?: string
	rvend?: string
	rvdir?: 'newer' | 'older'
	rvuser?: string
	rvexcludeuser?: string
	rvtag?: string
	rvcontinue?: string
	titles: string | string[]
}