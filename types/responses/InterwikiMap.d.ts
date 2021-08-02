namespace MWResponse {
	export interface InterwikiMap {
		query: {
			interwikimap: {
				prefix: 'string'
				language: string
				url: string
			}[]
		}
	}
}