/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'dotenv/config'
import 'mocha'
import {
	Bot, Fandom
} from '../main'
import assert from 'assert'

describe( 'Bot', () => {
	const {
		FANDOM_PASSWORD, FANDOM_USERNAME, FANDOM_WIKI
	} = process.env as Record<string, string>
	const fandom = new Fandom()
	const wiki = fandom.getWiki( FANDOM_WIKI.trim() )
	let bot: Bot

	const login = it( '#login', async () => {
		bot = await fandom.login( {
			password: FANDOM_PASSWORD.trim(),
			username: FANDOM_USERNAME.trim(),
			wiki
		} )
		const whoAmI = await bot.whoAmI()
		assert.notStrictEqual( whoAmI.query.userinfo.id, 0 )
	} ).timeout( 5000 )

	it( '#edit', async () => {
		assert.strictEqual( login.isPassed(), true )

		const action = await bot.edit( {
			text: 'This is a test.',
			title: 'Test'
		} )

		assert.strictEqual( action.edit.result, 'Success' )
	} )

	it( '#delete', async () => {
		assert.strictEqual( login.isPassed(), true )

		await bot.delete( {
			title: 'Test'
		} )
	} )
} )
