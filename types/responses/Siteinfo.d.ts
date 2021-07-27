interface ISiteinfoGeneral {
	mainpage: string
	base: string
	sitename: string
	readonly: boolean
	writeapi: boolean
	articlepath: string
	scriptpath: string
	script: string
	server: string
	wikiid: string
}

type INamespace = {
	id: 0
	name: ''
	content: true
} | {
	id: number
	name: string
	canonical: string
	content: boolean
}

type ISiteinfoVariables = {
	id: 'wgLanguageCode'
	'*': string
} | {
	id: 'wgCityId'
	'*': number
}

interface ISiteinfoResponse {
	query: {
		general: ISiteinfoGeneral
		namespaces: Record<`${number}`, INamespace>
		variables: ISiteinfoVariables[]
	}
}