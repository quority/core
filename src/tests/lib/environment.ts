import { load } from 'ts-dotenv'

export const env = load( {
	BP_PASSWORD: String,
	BP_USERNAME: String,
	FANDOM_PASSWORD: String,
	FANDOM_USERNAME: String,
	FANDOM_WIKI: String
} )
