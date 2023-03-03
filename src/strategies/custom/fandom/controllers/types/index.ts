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

export interface DiscussionPost {
	_embedded: {
		attachments: Array<{
			atMentions: unknown[]
			contentImages: unknown[]
			openGraphs: unknown[]
			polls: unknown[]
			quizzes: unknown[]
		}>
		contentImages: unknown[]
		userData: Array<{
			hasReported: boolean
			hasUpvoted: boolean
			permissions: string[]
		}>
	}
	createdBy: {
		avatarUrl: string
		badgePermission: string
		id: `${ number }`
		name: string
	}
	creationDate: ArticleCommentsBody[ 'firstPost' ][ 'creationDate' ]
	creatorId: `${ number }`
	creatorIp: string
	id: `${ number }`
	isDeleted: boolean
	isEditable: boolean
	isLocked: boolean
	isReported: boolean
	jsonModel: unknown | null
	latestRevisionId: `${ number }`
	modificationDate: ArticleCommentsBody[ 'firstPost' ][ 'creationDate' ] | null
	position: number
	rawContent: string
	renderedContent: unknown | null
	requesterId: `${ number }`
	siteId: `${ number }`
	threadId: `${ number }`
	title: string
	upvoteCount: number
}

export interface DiscussionThreadBody {
	_embedded: {
		contentImages: unknown[]
		attachments: Array<{
			atMentions: unknown[]
			contentImages: unknown[]
			openGraphs: unknown[]
			polls: unknown[]
			quizzes: unknown[]
		}>
		firstPost: DiscussionPost[]
		userData: Array<{
			hasReported: boolean
			hasUpvoted: boolean
			permissions: string[]
		}>
	}
	createdBy: {
		avatarUrl: string
		badgePermission: string
		id: `${ number }`
		name: string
	}
	creationDate: ArticleCommentsBody[ 'firstPost' ][ 'creationDate' ]
	firstPostId: `${ number }`
	forumId: `${ number }`
	forumName: string
	funnel: string
	id: `${ number }`
	isDeleted: boolean
	isEditable: boolean
	isFollowed: boolean
	isLocked: boolean
	isReported: boolean
	jsonModel: unknown | null
	lastPostId: `${ number }`
	latestRevisionId: `${ number }`
	modificationDate: ArticleCommentsBody[ 'firstPost' ][ 'creationDate' ]
	postCount: number
	rawContent: string
	renderedContent: unknown | null
	requesterId: `${ number }`
	siteId: `${ number }`
	source: string
	tags: unknown | null
	title: string
	trendingScore: number
	upvoteCount: number
}

export interface DiscussionForumBody {
	_embedded: {
		contributors: Array<{
			count: number
			userInfo: Array<{
				avatarUrl: string
				badgePermission: string
				id: `${ number }`
				name: string
			}>
		}>
		'doc:threads': DiscussionThreadBody[]
	}
	allowsThreads: boolean
	creationDate: ArticleCommentsBody[ 'firstPost' ][ 'creationDate' ]
	creatorId: `${ number }`
	description: string | null
	displayOrder: number
	id: `${ number }`
	imageUrl: string | null
	isDeleted: boolean
	isEditable: boolean
	isLocked: boolean
	latestContribution: {
		author: number | null
		date: ArticleCommentsBody[ 'firstPost' ][ 'creationDate' ] | null
		item: string | null
		itemId: number | null
		forumId: number | null
		siteId: number | null
	} | null
	name: string
	parentId: '1'
	postCount: 0
	recentContributors: Array<{
		avatarUrl: string
		badgePermission: string
		id: `${ number }`
		name: string
	}> | null
	requesterId: `${ number }`
	siteId: `${ number }`
	threadCount: 0
}

export interface DiscussionForums extends Omit<DiscussionForumBody, '_embedded'> {
	_embedded: {
		'doc:forum': Array<Omit<DiscussionForumBody, '_embedded'>>
	}
}
