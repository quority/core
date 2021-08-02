namespace MWRequest {
	export interface CategoryMembers extends MWRequest.ApiQuery {
		cmtitle?: string
		cmnamespace?: number | string
		cmtype?: string
		cmcontinue?: string
		cmlimit?: number | 'max'
		cmsort?: 'sortkey' | 'timestamp'
		cmdir?: 'ascending' | 'descending' | 'newer' | 'older'
		cmstart?: string
		cmend?: string
	}
}