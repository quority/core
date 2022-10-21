import { load } from 'ts-dotenv'

export const env = load( {
	FANDOM_PASSWORD: String,
	FANDOM_USERNAME: String,
	FANDOM_WIKI: String
} )