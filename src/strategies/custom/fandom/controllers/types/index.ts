export interface ArticleCommentsBody {
	containerId: `${ number }`
	creationDate: {
		epochSecond: number
		nano: number
	}
	firstPost: {
		attachments: {
			atMentions: unknown[]
			contentImages: unknown[]
			openGraphs: unknown[]
			polls: unknown[]
			quizzes: unknown[]
		}
		createdBy: {
			avatarUrl: string
			badgePermission: string
			id: `${ number }`
			name: string
		}
		creationDate: {
			epochSecond: number
			nano: number
		}
		id: `${ number }`
		jsonModel: string
		upvoteCount: number
		userData: {
			hasUpvoted: boolean
			isReported: boolean
			permissions: {
				canEdit: boolean
				canDelete: boolean
			}
			postId: number
		}
	}
	followed: boolean
	id: `${ number }`
	postId: `${ number }`
	posts: Array<ArticleCommentsBody[ 'firstPost' ]>
	readOnlyMode: boolean
}

export interface ArticleCommentsReply {
	followed: boolean
	reply: ArticleCommentsBody[ 'firstPost' ]
	threadId: `${ number }`
}

export interface ArticleCommentsThread {
	thread: ArticleCommentsBody
	reportedData: {
		posts: unknown[]
	}
}

export interface ArticleCommentsResponse {
	links: unknown[]
	readOnlyMode: boolean
	reportedData: {
		posts: unknown[]
	}
	threads: ArticleCommentsBody[]
	totalCount: number
}

export type ArticleCommentsEdited = ArticleCommentsBody[ 'firstPost' ] & {
	lastEditedBy: {
		avatarUrl: string
		badgePermission: string
		id: `${ number }`
		name: string
	}
}
