/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'dotenv/config'
import 'mocha'
import {
	BaseBot, BaseWiki
} from '../main'
import assert from 'assert'

describe( `Wikipedia`, () => {
	const {
		WIKIPEDIA_API, WIKIPEDIA_PASSWORD, WIKIPEDIA_USERNAME
	} = process.env as Record<string, string>
	const wiki = new BaseWiki( {
		api: WIKIPEDIA_API
	} )
	const bot = new BaseBot( {
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
