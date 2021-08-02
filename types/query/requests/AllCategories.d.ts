namespace MWRequest {
	export interface AllCategories extends MWRequest.ApiQuery {
		acfrom?: string
		accontinue?: string
		acto?: string
		acprefix?: string
		acdir?: 'ascending' | 'descending'
		acmin?: number
		acmax?: number
		aclimit?: number | 'max'
		acprop?: Array<'size' | 'hidden'>
	}
}