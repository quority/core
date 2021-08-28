/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'dotenv/config'
import 'mocha'
import {
	Bot, Wiki
} from '../main'
import assert from 'assert'

describe( 'Wikipedia', () => {
	const {
		WIKIPEDIA_API, WIKIPEDIA_PASSWORD, WIKIPEDIA_USERNAME
	} = process.env as Record<string, string>
	const wiki = new Wiki( {
		api: WIKIPEDIA_API
	} )
	const bot = new Bot( {
		password: WIKIPEDIA_PASSWORD,
		username: WIKIPEDIA_USERNAME,
		wiki
	} )

	it( '#login', async () => {
		await bot.login()
		const whoAmI = await bot.whoAmI()
		assert.notStrictEqual( whoAmI.query.userinfo.id, 0 )
	} ).timeout( 5000 )
} )
