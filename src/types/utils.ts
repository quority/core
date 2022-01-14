import type fs from 'fs'

export type ReducedRequest<T> = Omit<T, 'action' | 'token'>

export type RequestGETParameters = Record<string, string | string[] | number | number[] | boolean | undefined> & {
	format?: 'json'
	formatversion?: 2
}

export type RequestPOSTParameters = Record<string, string | string[] | number | number[] | boolean | fs.ReadStream | undefined> & {
	format?: 'json'
	formatversion?: 2
}

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
	Pick<T, Exclude<keyof T, Keys>>
	& {
		[K in Keys]-?:
			Required<Pick<T, K>>
			& Partial<Record<Exclude<Keys, K>, undefined>>
	}[Keys]

export type TokenType = 'createaccount' | 'csrf' | 'deleteglobalaccount' | 'login' | 'patrol' | 'rollback' | 'setglobalaccountstatus' | 'userrights' | 'watch'
