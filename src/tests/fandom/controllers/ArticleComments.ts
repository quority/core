import 'mocha'
import assert from 'assert'
import { env } from '../../lib'
import { Fandom, Wiki } from '../../../main'

describe( 'ArticleCommentsController', () => {
	const wiki = new Wiki( {
		api: env.FANDOM_WIKI,
		platform: Fandom
	} )
	const title = 'ArticleCommentsController'
	let articleId: string
	let replyId: string
	let rootCommentId: string
	let threadId: string

	before( async function() {
		this.timeout( 5000 )
		await wiki.platform.login( env.FANDOM_USERNAME, env.FANDOM_PASSWORD )
	} )

	const controller = wiki.custom.wikia.ArticleComments

	it( '#postNewCommentThread', async () => {
		const comment = await controller.postNewCommentThread( {
			jsonModel: {
				content: [ {
					content: [ {
						text: 'This is a test.',
						type: 'text'
					} ],
					type: 'paragraph'
				} ],
				type: 'doc'
			},
			namespace: 0,
			title
		} )

		rootCommentId = comment.firstPost.id
		threadId = comment.id
		assert.strictEqual( comment.firstPost.createdBy.name, env.FANDOM_USERNAME )
	} )

	it( '#postNewCommentReply', async () => {
		const reply = await controller.postNewCommentReply( {
			jsonModel: {
				content: [ {
					content: [ {
						text: 'This is a reply.',
						type: 'text'
					} ],
					type: 'paragraph'
				} ],
				type: 'doc'
			},
			namespace: 0,
			threadId,
			title
		} )

		replyId = reply.reply.id
		assert.strictEqual( reply.reply.createdBy.name, env.FANDOM_USERNAME )
	} )

	it( '#getThread', async () => {
		const thread = await controller.getThread( threadId, title )
		articleId = thread.thread.containerId

		assert.strictEqual( thread.thread.id, threadId )
		assert.strictEqual( thread.thread.firstPost.id, rootCommentId )
		assert.strictEqual( thread.thread.posts.at( 0 )?.id, replyId )
	} )

	it( '#getArticleTitle', async () => {
		const article = await controller.getArticleTitle( articleId )

		assert.strictEqual( article, title )
	} )

	it( '#getCommentCount', async () => {
		const count = await controller.getCommentCount( title )
		if ( count <= 0 ) {
			assert.fail()
		}
	} )

	it( '#getComments', async () => {
		const comments = await controller.getComments( title )
		const thread = comments.threads.find( t => t.id === threadId )

		assert.strictEqual( thread?.firstPost.id, rootCommentId )
		assert.strictEqual( thread.posts.at( 0 )?.id, replyId )
	} )

	it( '#editComment', async () => {
		const editComment = await controller.editComment( {
			jsonModel: {
				content: [ {
					content: [ {
						text: 'Edited comment.',
						type: 'text'
					} ],
					type: 'paragraph'
				} ],
				type: 'doc'
			},
			namespace: 0,
			postId: rootCommentId,
			title
		} )
		const editReply = await controller.editComment( {
			jsonModel: {
				content: [ {
					content: [ {
						text: 'Edited reply.',
						type: 'text'
					} ],
					type: 'paragraph'
				} ],
				type: 'doc'
			},
			namespace: 0,
			postId: replyId,
			title
		} )

		assert.strictEqual( editComment.lastEditedBy.name, env.FANDOM_USERNAME )
		assert.strictEqual( editReply.lastEditedBy.name, env.FANDOM_USERNAME )
	} )

	it( '#reportPost', async () => {
		const reported = await controller.reportPost( {
			namespace: 0,
			postId: replyId,
			title
		} )

		assert.strictEqual( reported, true )
	} )

	it( '#deletePost', async () => {
		const deleted = await controller.deletePost( replyId )

		assert.strictEqual( deleted, true )
	} )

	it( '#undeletePost', async () => {
		const undeleted = await controller.undeletePost( replyId )

		assert.strictEqual( undeleted, true )
	} )

	after( async () => {
		await controller.deletePost( rootCommentId )
	} )
} )
