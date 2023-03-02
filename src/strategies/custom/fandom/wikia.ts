import type { Wiki } from '../../../mediawiki'
import type { Fandom } from '../../FandomStrategy'
import { BaseEndpoint } from '../BaseEndpoint'
import { ArticleCommentsController, DiscussionContributionController, DiscussionForumController, DiscussionLeaderboardController, DiscussionModerationController, DiscussionPermalinkController, DiscussionPollController, DiscussionPostController, DiscussionThreadController, DiscussionVoteController } from './controllers'

export enum WikiaControllers {
	ArticleComments = 'ArticleComments',
	DiscussionContribution = 'DiscussionContribution',
	DiscussionForum = 'DiscussionForum',
	DiscussionImages = 'DiscussionImages',
	DiscussionLeaderboard = 'DiscussionLeaderboard',
	DiscussionModeration = 'DiscussionModeration',
	DiscussionPermalink = 'DiscussionPermalink',
	DiscussionPoll = 'DiscussionPoll',
	DiscussionPost = 'DiscussionPost',
	DiscussionThread = 'DiscussionThread',
	DiscussionVote = 'DiscussionVote',
	FeedsAndPosts = 'FeedsAndPosts',
	MessageWall = 'MessageWall'
}

export class WikiaEndpoint extends BaseEndpoint<Fandom> {
	public readonly ArticleComments: ArticleCommentsController
	public readonly DiscussionContribution: DiscussionContributionController
	public readonly DiscussionForum: DiscussionForumController
	public readonly DiscussionLeaderboard: DiscussionLeaderboardController
	public readonly DiscussionModerationController: DiscussionModerationController
	public readonly DiscussionPermalinkController: DiscussionPermalinkController
	public readonly DiscussionPollController: DiscussionPollController
	public readonly DiscussionPostController: DiscussionPostController
	public readonly DiscussionThreadController: DiscussionThreadController
	public readonly DiscussionVoteController: DiscussionVoteController

	public constructor( wiki: Wiki<Fandom> ) {
		super( wiki, new URL( 'wikia.php', wiki.api ) )
		this.ArticleComments = new ArticleCommentsController( this )
		this.DiscussionContribution = new DiscussionContributionController( this )
		this.DiscussionForum = new DiscussionForumController( this )
		this.DiscussionLeaderboard = new DiscussionLeaderboardController( this )
		this.DiscussionModerationController = new DiscussionModerationController( this )
		this.DiscussionPermalinkController = new DiscussionPermalinkController( this )
		this.DiscussionPollController = new DiscussionPollController( this )
		this.DiscussionPostController = new DiscussionPostController( this )
		this.DiscussionThreadController = new DiscussionThreadController( this )
		this.DiscussionVoteController = new DiscussionVoteController( this )
	}

}
