interface ILoginResponse {
	login: {
		result: 'Success'
		lguserid: number
		lgusername: string
	} | {
		result: 'Failed'
		reason: string
	}
}