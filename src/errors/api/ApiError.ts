export class ApiError extends Error {
	static readonly code: string | string[]
	readonly info: string

	constructor( info: string ) {
		super( info )
		this.info = info
	}
}
