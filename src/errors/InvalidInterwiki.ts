export class InvalidInterwiki extends Error {
	constructor( interwiki: string ) {
		super( `Invalid interwiki: ${interwiki}` )
	}
}