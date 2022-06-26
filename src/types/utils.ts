export type RequireOnlyOne<T, U extends keyof T, V extends keyof T> = Omit<T, U | V> & (
	( { [ k in U ]: T[ U ] } & { [ k in V ]?: undefined } )
	| ( { [ k in V ]: T[ V ] } & { [ k in U ]?: undefined } )
)

export type RequireOnlyOneFromThree<T, U extends keyof T, V extends keyof T, W extends keyof T> = Omit<T, U | V | W> & (
	( { [ k in U ]: T[ U ] } & { [ k in V | W ]?: undefined } )
	| ( { [ k in V ]: T[ V ] } & { [ k in U | W ]?: undefined } )
	| ( { [ k in W ]: T[ W ] } & { [ k in U | V ]?: undefined } )
)

export type MaybeArray<T> = T | T[]
