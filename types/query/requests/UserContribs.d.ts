interface IApiQueryUsercontribsRequest extends IApiQueryRequest {
	uclimit?: number | 'max'
	ucstart?: string
	ucend?: string
	uccontinue?: string
	ucuser: string
	ucdir?: 'newer' | 'older'
	ucnamespace?: number | number[]
	ucprop?: Array<'ids' | 'title' | 'timestamp' | 'comment' | 'parsedcomment' | 'size' | 'sizediff' | 'flags' | 'patrolled' | 'tags'>
	ucshow?: Array< '!autopatrolled', '!minor', '!new', '!patrolled', '!top', 'autopatrolled', 'minor', 'new', 'patrolled', 'top' >
	uctag?: string
}