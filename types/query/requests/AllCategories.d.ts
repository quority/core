interface IApiQueryAllcategoriesRequest extends IApiQueryRequest {
	acfrom?: string
	accontinue?: string
	acto?: string
	acprefix?: string
	acdir?: 'ascending' | 'descending'
	acmin?: number
	acmax?: number
	aclimit?: number | 'max'
	acprop?: 'size' | 'hidden' | 'hidden|size'
}