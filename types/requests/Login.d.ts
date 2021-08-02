namespace MWRequest {
	export interface Login {
		action: 'login'
		lgname: string
		lgpassword: string
		lgtoken: string
	}
}