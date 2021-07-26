type TokenType = 'createaccount' | 'csrf' | 'deleteglobalaccount' | 'login' | 'patrol' | 'rollback' | 'setglobalaccountstatus' | 'userrights' | 'watch'
type ITokenType = 'createaccounttoken' | 'csrftoken' | 'deleteglobalaccounttoken' | 'logintoken' | 'patroltoken' | 'rollbacktoken' | 'setglobalaccountstatustoken' | 'userrightstoken' | 'watchtoken'

interface IApiQueryTokensResponse<T extends ITokenType> extends IApiQueryResponse {
	query: {
		tokens: {
			[k in T]: string
		}
	}
}
