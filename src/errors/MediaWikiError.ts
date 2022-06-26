export class MediaWikiError extends Error {
	public data: unknown

	public constructor( error: unknown ) {
		const msg = typeof error === 'object' && error !== null
			? Object.entries( error ).map( ( [
				k, v
			] ) => `\t${ k } = ${ v }` )
				.join( '\n' )
			: ''
		super( `Your request returned an error object.\n${ msg }` )
	}
}
