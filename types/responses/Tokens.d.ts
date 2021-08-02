namespace MWResponse {
	export interface Tokens<T extends TokenType> {
		query: {
			tokens: {
				[ key in `${T}token` ]: string
			}
		}
	}
}