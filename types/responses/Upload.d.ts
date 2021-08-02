namespace MWResponse {
	export interface Upload {
		upload: {
			result: 'Success' | string
			filename?: string
		}
	}
}