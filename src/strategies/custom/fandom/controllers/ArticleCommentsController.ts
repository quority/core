import type { Dispatcher } from 'undici'
import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'

export interface CommentOptions {
	attachments?: Record<string, unknown>
	jsonModel: Record<string, unknown>
	namespace: number
	title: string
}

export interface EditCommentOptions extends CommentOptions {
	postId: string
}

export interface CommentReplyOptions extends CommentOptions {
	threadId: string
}

export interface ReportCommentOptions {
	namespace: number
	postId: string
	title: string
}

export class ArticleCommentsController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'ArticleComments'

	public async deletePost( postId: string ): Promise<void> {
		await this.post( {
			method: 'deletePost',
			postId,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
	}

	public async editComment( options: EditCommentOptions ): Promise<Dispatcher.ResponseData> {
		options.attachments ??= ArticleCommentsController.attachmentsDefault

		return this.post( {
			attachments: JSON.stringify( options.attachments ),
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'editComment',
			namespace: `${ options.namespace }`,
			postId: options.postId,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
	}

	public async getArticleTitle( stablePageId: number ): Promise<string> {
		const req = await this.get( {
			method: 'getArticleTitle',
			stablePageId: `${ stablePageId }`
		} )
		const res = await req.body.json() as {
			title: string
		}
		return res.title
	}

	public async getCommentCount( title: string, namespace = 0, hideDeleted = true ): Promise<number> {
		const req = await this.get( {
			hideDeleted: `${ hideDeleted }`,
			method: 'getCommentCount',
			namespace: `${ namespace }`,
			title
		} )
		return req.body.json() as Promise<number>
	}

	public async getComments( title: string, namespace = 0, hideDeleted = true ): Promise<unknown> {
		const req = await this.get( {
			hideDeleted: `${ hideDeleted }`,
			method: 'getComments',
			namespace: `${ namespace }`,
			title
		} )
		return req.body.json()
	}

	public async getThread( threadId: string, title: string, namespace = 0, hideDeleted = true ): Promise<unknown> {
		const req = await this.get( {
			hideDeleted: `${ hideDeleted }`,
			method: 'getThread',
			namespace: `${ namespace }`,
			threadId,
			title
		} )
		return req.body.json()
	}

	public async postNewCommentReply( options: CommentReplyOptions ): Promise<unknown> {
		options.attachments ??= ArticleCommentsController.attachmentsDefault
		const req = await this.post( {
			attachments: JSON.stringify( options.attachments ),
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'postNewCommentReply',
			namespace: `${ options.namespace }`,
			threadId: options.threadId,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json()
	}

	public async postNewCommentThread( options: CommentOptions ): Promise<unknown> {
		options.attachments ??= ArticleCommentsController.attachmentsDefault
		const req = await this.post( {
			attachments: JSON.stringify( options.attachments ),
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'postNewCommentThread',
			namespace: `${ options.namespace }`,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json()
	}

	public async reportPost( options: ReportCommentOptions ): Promise<unknown> {
		const req = await this.post( {
			method: 'reportPost',
			namespace: `${ options.namespace }`,
			postId: options.postId,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json()
	}

	public async undeletePost( postId: string ): Promise<unknown> {
		const req = await this.post( {
			method: 'undeletePost',
			postId,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json()
	}
}
