export class LoginFailedError extends Error {
	constructor() {
		super( 'The supplied credentials could not be authenticated.' )
	}
}
