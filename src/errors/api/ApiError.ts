export class ApiError extends Error {
	public static readonly code: string | string[]
	public readonly info: string

	public constructor( info: string ) {
		super( info )
		this.info = info
	}
}
