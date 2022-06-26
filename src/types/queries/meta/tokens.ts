import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { Response } from '../../Response'

export type TokenType = 'createaccount' | 'csrf' | 'deleteglobalaccount' | 'login' | 'patrol' | 'rollback' | 'setglobalaccountstatus' | 'userrights' | 'watch'

/**
 * Options for `meta=allmessages`.
 */
export interface TokensRequest extends QueryRequest {
	meta: 'tokens'

	/**
	 * Types of token to request.
	 */
	type: MaybeArray<TokenType>
}

export interface TokensResponse<T extends TokenType = TokenType> extends Response {
	query: {
		tokens: {
			[ key in `${ T }token` ]: string
		}
	}
}
