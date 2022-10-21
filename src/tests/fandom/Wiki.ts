import 'mocha'
import assert from 'assert'
import { Fandom } from '../../main'

describe( 'Fandom wiki', () => {
	const wiki = Fandom.getWiki( 'es.genshin-impact' )

	it( '#load', async () => {
		const loaded = await wiki.load()
		assert.notStrictEqual(loaded.id, 0)
	} )

	it( '#getURL', () => {
		console.log( wiki.getURL( 'Tartaglia' ), wiki.getURL( 'Tartaglia 2' ) )
	} )
} )
