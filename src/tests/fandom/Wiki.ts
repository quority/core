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
		const random = `${ Math.random() }`
		assert.strictEqual(
			wiki.getURL( random ),
			`https://genshin-impact.fandom.com/es/wiki/${ random }`
		)

		assert.strictEqual(
			wiki.getURL( `${ random } ${ random }` ),
			`https://genshin-impact.fandom.com/es/wiki/${ random }_${ random }`
		)
	} )

	it( '#getPages', async () => {
		const single = await wiki.getPages( 'Tartaglia' )
		assert.notStrictEqual( single.length, 0 )

		const multiple = await wiki.getPages( [ 'Tartaglia', 'Xiao' ] )
		assert.strictEqual( typeof multiple.Tartaglia, 'string' )
		assert.strictEqual( typeof multiple.Xiao, 'string' )
	} )

	it( '#pagesExist', async () => {
		const singleExists = await wiki.pagesExist( 'Tartaglia' )
		assert.strictEqual( singleExists, true )

		const multipleExists = await wiki.pagesExist( [ 'Tartaglia', 'Venti', 'Xiao', 'Inexistent' ] )
		assert.strictEqual( multipleExists.Tartaglia, true )
		assert.strictEqual( multipleExists.Venti, true )
		assert.strictEqual( multipleExists.Xiao, true )
		assert.strictEqual( multipleExists.Inexistent, false )
	} )

	it( '#parse', async () => {
		const parse = await wiki.parse( {
			text: '{{NUMBEROFARTICLES}}'
		} )
		assert.strictEqual( parse.parse.title, 'API' )
	} )

	it( '#purge', async () => {
		const purge = await wiki.purge( [ 'Usuario:Bitomic' ] )
		assert.strictEqual( purge['Usuario:Bitomic'], true )
	} )

	it( '#search', async () => {
		const search = await wiki.search( {
			search: 'Espada'
		} )
		assert.strictEqual(Array.isArray(search), true)
		assert.strictEqual(typeof search[0], 'string')
		assert.strictEqual(Array.isArray(search[1]), true)
	} )

	describe( '#queryList', () => {
		it( 'allcategories', async () => {
			const query = ( await wiki.queryList( {
				aclimit: 50,
				list: 'allcategories'
			}, 100 ) ).map( i => i.category )

			assert.strictEqual( Array.isArray( query ), true )
			assert.strictEqual( typeof query[ 0 ], 'string' )
			assert.strictEqual( query.length, 100 )
		} )

		it( 'allimages', async () => {
			const query = ( await wiki.queryList( {
				ailimit: 50,
				list: 'allimages'
			}, 100 ) ).map( i => i.name )

			assert.strictEqual( Array.isArray( query ), true )
			assert.strictEqual( typeof query[ 0 ], 'string' )
			assert.strictEqual( query.length, 100 )
		} )

		it( 'allpages', async () => {
			const query = ( await wiki.queryList( {
				aplimit: 50,
				list: 'allpages'
			}, 100 ) ).map( i => i.title )

			assert.strictEqual( Array.isArray( query ), true )
			assert.strictEqual( typeof query[ 0 ], 'string' )
			assert.strictEqual( query.length, 100 )
		} )

		it( 'categorymembers', async () => {
			const query = ( await wiki.queryList( {
				cmlimit: 'max',
				cmtitle: 'Category:Personajes jugables',
				list: 'categorymembers'
			}, 100 ) ).map( i => i.title )

			assert.strictEqual( Array.isArray( query ), true )
			assert.strictEqual( typeof query[ 0 ], 'string' )
		} )

		it( 'logevents', async () => {
			const query = ( await wiki.queryList( {
				leaction: 'block/block',
				lelimit: 5,
				list: 'logevents'
			}, 10 ) )

			assert.strictEqual( Array.isArray( query ), true )
			assert.strictEqual( query.length, 10 )
		} )

		it( 'recentchanges', async () => {
			const query = ( await wiki.queryList( {
				list: 'recentchanges',
				rclimit: 5
			}, 10 ) )

			assert.strictEqual( Array.isArray( query ), true )
			assert.strictEqual( query.length, 10 )
		} )

		it( 'usercontribs', async () => {
			const query = ( await wiki.queryList( {
				list: 'usercontribs',
				uclimit: 5,
				ucuser: 'User:Botomic'
			}, 10 ) )

			assert.strictEqual( Array.isArray( query ), true )
			assert.strictEqual( query.length, 10 )
		} )
	} )

	describe( '#queryProp', () => {
		it( 'categories', async () => {
			const single = ( await wiki.queryProp( {
				cllimit: 'max',
				prop: 'categories',
				titles: 'Tartaglia'
			} ) )
			assert.strictEqual( single[ 0 ]?.title, 'Tartaglia' )
			assert.strictEqual( Array.isArray( single[ 0 ]?.categories ), true )
			
			const multiple = ( await wiki.queryProp( {
				cllimit: 'max',
				prop: 'categories',
				titles: [ 'Tartaglia', 'Xiao' ]
			} ) )
			assert.strictEqual( Array.isArray( multiple[ 0 ]?.categories ), true )
			assert.strictEqual( Array.isArray( multiple[ 1 ]?.categories ), true )
		} )
	} )
} )
