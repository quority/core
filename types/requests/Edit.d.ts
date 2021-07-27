type IApiEditRequest = {
	bot?: boolean
	minor?: boolean
	notminor?: boolean
	recreate?: boolean
	text: string
	title: string
}