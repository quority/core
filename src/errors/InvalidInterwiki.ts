export class InvalidInterwikiError extends Error {
	constructor( interwiki: string ) {
		super( `Invalid interwiki: ${ interwiki }` )
	}
}
