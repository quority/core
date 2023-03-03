import type { WikiaEndpoint } from '../wikia'
import { BaseController } from './BaseController'
import type { ArticleCommentsBody, ArticleCommentsEdited, ArticleCommentsReply, ArticleCommentsResponse, ArticleCommentsThread } from './types'

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

	public async deletePost( postId: string ): Promise<boolean> {
		const req = await this.post( {
			controller: this.controller,
			method: 'deletePost',
			postId,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.statusCode >= 200 && req.statusCode < 300
	}

	public async editComment( options: EditCommentOptions ): Promise<ArticleCommentsEdited> {
		options.attachments ??= ArticleCommentsController.attachmentsDefault

		const req = await this.post( {
			attachments: JSON.stringify( options.attachments ),
			controller: this.controller,
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'editComment',
			namespace: `${ options.namespace }`,
			postId: options.postId,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json() as Promise<ArticleCommentsEdited>
	}

	public async getArticleTitle( stablePageId: number | string ): Promise<string> {
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

	public async getComments( title: string, namespace = 0, hideDeleted = true ): Promise<ArticleCommentsResponse> {
		const req = await this.get( {
			hideDeleted: `${ hideDeleted }`,
			method: 'getComments',
			namespace: `${ namespace }`,
			title
		} )
		return req.body.json() as Promise<ArticleCommentsResponse>
	}

	public async getThread( threadId: string, title: string, namespace = 0, hideDeleted = true ): Promise<ArticleCommentsThread> {
		const req = await this.get( {
			hideDeleted: `${ hideDeleted }`,
			method: 'getThread',
			namespace: `${ namespace }`,
			threadId,
			title
		} )
		return req.body.json() as Promise<ArticleCommentsThread>
	}

	public async postNewCommentReply( options: CommentReplyOptions ): Promise<ArticleCommentsReply> {
		options.attachments ??= ArticleCommentsController.attachmentsDefault
		const req = await this.post( {
			attachments: JSON.stringify( options.attachments ),
			controller: this.controller,
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'postNewCommentReply',
			namespace: `${ options.namespace }`,
			threadId: options.threadId,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json() as Promise<ArticleCommentsReply>
	}

	public async postNewCommentThread( options: CommentOptions ): Promise<ArticleCommentsBody> {
		options.attachments ??= ArticleCommentsController.attachmentsDefault
		const req = await this.post( {
			attachments: JSON.stringify( options.attachments ),
			controller: this.controller,
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'postNewCommentThread',
			namespace: `${ options.namespace }`,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json() as Promise<ArticleCommentsBody>
	}

	public async reportPost( options: ReportCommentOptions ): Promise<boolean> {
		const req = await this.post( {
			controller: this.controller,
			method: 'reportPost',
			namespace: `${ options.namespace }`,
			postId: options.postId,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.statusCode >= 200 && req.statusCode < 300
	}

	public async undeletePost( postId: string ): Promise<boolean> {
		const req = await this.post( {
			controller: this.controller,
			method: 'undeletePost',
			postId,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.statusCode >= 200 && req.statusCode < 300
	}
}
