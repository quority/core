import 'mocha'
import assert from 'assert'
import { Wiki } from '../../main'

describe( 'Fandom wiki', () => {
	const wiki = new Wiki( {
		api: 'https://genshin-impact.fandom.com/es/api.php'
	} )

	it( '#getUrl', () => {
		const random = `${ Math.random() }`
		assert.strictEqual(
			wiki.getUrl( random ).href,
			`https://genshin-impact.fandom.com/es/wiki/${ random }`
		)

		assert.strictEqual(
			wiki.getUrl( `${ random } ${ random }` ).href,
			`https://genshin-impact.fandom.com/es/wiki/${ random }%20${ random }`
		)
	} )

	it( '#getPages', async () => {
		const single = await wiki.getPage( 'Tartaglia' )
		assert.notStrictEqual( single.length, 0 )

		const multiple = await wiki.getPages( [ 'Tartaglia', 'Xiao' ] )
		assert.strictEqual( typeof multiple.Tartaglia, 'string' )
		assert.strictEqual( typeof multiple.Xiao, 'string' )
	} )

	it( '#parse', async () => {
		const parse = await wiki.parse( {
			text: '{{NUMBEROFARTICLES}}'
		} )
		assert.strictEqual( parse.parse.title, 'API' )
	} )

	it( '#purge', async () => {
		await wiki.purge( [ 'Usuario:Bitomic' ] )
	} )

	it( '#search', async () => {
		const search = await wiki.search( {
			search: 'Espada'
		} )
		assert.strictEqual( Array.isArray( search ), true )
		assert.strictEqual( typeof search[ 0 ], 'string' )
		assert.strictEqual( Array.isArray( search[ 1 ] ), true )
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
			const query =  await wiki.queryList( {
				leaction: 'block/block',
				lelimit: 5,
				list: 'logevents'
			}, 10 )

			assert.strictEqual( Array.isArray( query ), true )
			assert.strictEqual( query.length, 10 )
		} )

		it( 'recentchanges', async () => {
			const query =  await wiki.queryList( {
				list: 'recentchanges',
				rclimit: 5
			}, 10 )

			assert.strictEqual( Array.isArray( query ), true )
			assert.strictEqual( query.length, 10 )
		} )

		it( 'usercontribs', async () => {
			const query =  await wiki.queryList( {
				list: 'usercontribs',
				uclimit: 5,
				ucuser: 'User:Botomic'
			}, 10 )

			assert.strictEqual( Array.isArray( query ), true )
			assert.strictEqual( query.length, 10 )
		} )
	} )

	describe( '#queryProp', () => {
		it( 'categories', async () => {
			const single =  await wiki.queryProp( {
				cllimit: 'max',
				prop: 'categories',
				titles: 'Tartaglia'
			} )
			assert.strictEqual( single[ 0 ]?.title, 'Tartaglia' )
			assert.strictEqual( Array.isArray( single[ 0 ]?.categories ), true )

			const multiple =  await wiki.queryProp( {
				cllimit: 'max',
				prop: 'categories',
				titles: [ 'Tartaglia', 'Xiao' ]
			} )
			assert.strictEqual( Array.isArray( multiple[ 0 ]?.categories ), true )
			assert.strictEqual( Array.isArray( multiple[ 1 ]?.categories ), true )
		} )
	} )
} )
