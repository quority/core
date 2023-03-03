import 'mocha'
import assert from 'assert'
import { env } from '../lib'
import { type Bot, Wiki } from '../../main'

const now = Date.now()

describe( 'Fandom bot', () => {
	const wiki = new Wiki( {
		api: env.FANDOM_WIKI
	} )
	let bot: Bot

	before( async () => {
		bot = await wiki.login( env.BP_USERNAME, env.BP_PASSWORD )
	} )

	it( '#login', async () => {
		assert.strictEqual( await bot.isLoggedIn(), true )
	} )

	it( '#edit', async () => {
		const action = await bot.edit( {
			text: 'This is a test.',
			title: `Test @ ${ now }`
		} )

		assert.strictEqual( action.edit.result, 'Success' )
	} )

	it( '#move', async () => {
		const from = `Test @ ${ now }`
		const to = `Moved @ ${ now }`
		const action = await bot.move( {
			from,
			ignorewarnings: true,
			noredirect: true,
			to
		} )

		assert.strictEqual( action.move.from, from )
		assert.strictEqual( action.move.to, to )
	} )

	it( '#protect', async () => {
		const action = await bot.protect( {
			protections: [ 'edit=sysop', 'move=sysop' ],
			title: `Moved @ ${ now }`
		} )

		assert.strictEqual( action.protect.title, `Moved @ ${ now }` )
	} )

	it( '#delete', async () => {
		await bot.delete( {
			title: `Moved @ ${ now }`
		} )
	} )

	it( '#block', async () => {
		const result = await bot.block( {
			user: 'User:Botomic'
		} )
		assert.strictEqual( typeof result.block.id, 'number' )
	} )

	it( '#unblock', async () => {
		const result = await bot.unblock( {
			user: 'User:Botomic'
		} )
		assert.strictEqual( typeof result.unblock.id, 'number' )
	} )

	it( '#rollback', async () => {
		await bot.edit( {
			appendtext: `${ now }`,
			nocreate: true,
			title: 'User:Bitomic'
		} )

		const action = await bot.rollback( {
			title: 'User:Bitomic',
			user: 'User:Botomic'
		} )
		assert.strictEqual( action.rollback.title, 'User:Bitomic' )
	} )
} )
