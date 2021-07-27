export class ApiError extends Error {
	readonly code: ApiErrorCode

	constructor( code: ApiErrorCode ) {
		super( `An error has occurred: ${ code }.` )
		this.code = code
	}
}
