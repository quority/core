export class ApiError extends Error {
	readonly code: string

	constructor( code: string ) {
		super( `An error has occurred: ${ code }.` )
		this.code = code
	}
}
