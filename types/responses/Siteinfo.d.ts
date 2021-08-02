namespace MWResponse {
	interface GeneralSiteInfo {
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

	type SiteInfoNamespace = {
		id: 0
		name: ''
		content: true
	} | {
		id: number
		name: string
		canonical: string
		content: boolean
	}

	type SiteInfoVariables = {
		id: 'wgLanguageCode'
		'*': string
	} | {
		id: 'wgCityId'
		'*': number
	}

	interface SiteInfo {
		query: {
			general: GeneralSiteInfo
			namespaces: Record<`${number}`, SiteInfoNamespace>
			variables: SiteInfoVariables[]
		}
	}
}