/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'dotenv/config'
import 'mocha'
import {
	Bot, Fandom
} from '../main'
import assert from 'assert'

const now = Date.now()

describe( `Bot @ ${ now }`, () => {
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
			title: `Test @ ${ now }`
		} )

		assert.strictEqual( action.edit.result, 'Success' )
	} )

	it( '#delete', async () => {
		assert.strictEqual( login.isPassed(), true )

		await bot.delete( {
			title: `Test @ ${ now }`
		} )
	} )

	it( '#setWiki', async () => {
		assert.strictEqual( login.isPassed(), true )

		const wikis = {
			comunidad: fandom.getWiki( 'comunidad' ),
			'genshin-impact': fandom.getWiki( 'es.genshin-impact' ),
			twice: fandom.getWiki( 'twice' )
		}

		let id: number

		for ( let i = 0; i < 2; i++ ) {
			await bot.setWiki( wikis.comunidad )
			id = await bot.whoAmI().then( res => res.query.userinfo.id )
			assert.notStrictEqual( id, 0 )

			await bot.setWiki( wikis['genshin-impact'] )
			id = await bot.whoAmI().then( res => res.query.userinfo.id )
			assert.notStrictEqual( id, 0 )

			await bot.setWiki( wikis.twice )
			id = await bot.whoAmI().then( res => res.query.userinfo.id )
			assert.notStrictEqual( id, 0 )
		}
	} ).timeout( 8000 )
} )
