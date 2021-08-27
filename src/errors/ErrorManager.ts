/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import * as errors from './api'

type ConstructorOf<T extends new ( ...args: any ) => any> = new ( ...args: any ) => InstanceType<T>
type ApiError = ConstructorOf<typeof errors.ApiError>

export class ErrorManager {
	private static errors = Object.entries( errors )
		.reduce( ( errors, [ _, error ] ) => {
			const {
				code
			} = error
			if ( code === undefined ) {
				return errors
			}
			if ( Array.isArray( code ) ) {
				for ( const c of code ) {
					errors[ c ] = error
				}
			} else {
				errors[ code ] = error
			}
			return errors
		}, {
		} as Record<string, ApiError> )

	static getError( code: string, ...args: unknown[] ): errors.ApiError {
		const error = ErrorManager.errors[ code ] ?? ErrorManager.errors.unknown
		return new error( ...args )
	}

	// eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
	private constructor() {

	}
}
