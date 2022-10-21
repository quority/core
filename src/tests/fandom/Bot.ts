/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'mocha'
import assert from 'assert'
import { env } from '../lib'
import { Fandom, FandomBot } from '../../main'

const now = Date.now()

describe( 'Fandom bot', () => {
	const fandom = new Fandom()
	let bot: FandomBot
	const wiki = fandom.getWiki( env.FANDOM_WIKI )
	
	before( async () => {
		const fandom = new Fandom()
		bot = await fandom.login( {
			password: env.FANDOM_PASSWORD,
			username: env.FANDOM_USERNAME,
			wiki
		} )
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

	it( '#setWiki', async () => {
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

			await bot.setWiki( wikis[ 'genshin-impact' ] )
			id = await bot.whoAmI().then( res => res.query.userinfo.id )
			assert.notStrictEqual( id, 0 )

			await bot.setWiki( wikis.twice )
			id = await bot.whoAmI().then( res => res.query.userinfo.id )
			assert.notStrictEqual( id, 0 )
		}

		await bot.setWiki( wiki )
		id = await bot.whoAmI().then( res => res.query.userinfo.id )
		assert.notStrictEqual( id, 0 )
	} ).timeout( 8000 )

	it( '#block', async () => {
		const result = await bot.block( {
			user: 'User:Botomic'
		} )
		assert.strictEqual(typeof result.block.id, 'number');
	} )

	it( '#unblock', async () => {
		const result = await bot.unblock( {
			user: 'User:Botomic'
		} )
		assert.strictEqual(typeof result.unblock.id, 'number');
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
		assert.strictEqual(action.rollback.title, 'User:Bitomic')
	} )
} )
