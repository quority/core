export class InvalidInterwikiError extends Error {
	public constructor( interwiki: string ) {
		super( `Invalid interwiki: ${ interwiki }` )
	}
}
