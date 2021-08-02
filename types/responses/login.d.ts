namespace MWResponse {
	export interface Login {
		login: {
			result: 'Success'
			lguserid: number
			lgusername: string
		} | {
			result: 'Failed'
			reason: string
		}
	}
}