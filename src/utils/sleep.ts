export const sleep = ( ms: number ): Promise<never> => new Promise<never>( r => setTimeout( r, ms ) )
