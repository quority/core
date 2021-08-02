namespace MWRequest {
	export interface AllImages extends MWRequest.ApiQuery {
		aisort?: 'name' | 'timestamp'
		aidir?: 'ascending' | 'descending' | 'newer' | 'older'
		aifrom?: string
		aicontinue?: string
		aistart?: string
		aiend?: string
		aiprop?: Array<'timestamp' | 'user' | 'userid' | 'comment' | 'parsedcomment' | 'canonicaltitle' | 'url' | 'size' | 'dimensions' | 'sha1' | 'mime' | 'mediatype' | 'metadata' | 'commonmetadata' | 'extmetadata' | 'bitdepth' | 'badfile'>
		aiprefix?: string
		aiminsize?: number
		aimaxsize?: number
		aiuser?: string
		aifilterbots?: 'all' | 'bots' | 'nobots'
		ailimit?: number | 'max'
	}
}