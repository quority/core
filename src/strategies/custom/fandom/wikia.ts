import type { Wiki } from '../../../mediawiki'
import type { Fandom } from '../../FandomStrategy'
import { BaseEndpoint } from '../BaseEndpoint'
import { ArticleCommentsController, DiscussionContributionController, DiscussionForumController, DiscussionImagesController } from './controllers'

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
	public readonly DiscussionImages: DiscussionImagesController

	public constructor( wiki: Wiki<Fandom> ) {
		super( wiki, new URL( 'wikia.php', wiki.api ) )
		this.ArticleComments = new ArticleCommentsController( this )
		this.DiscussionContribution = new DiscussionContributionController( this )
		this.DiscussionForum = new DiscussionForumController( this )
		this.DiscussionImages = new DiscussionImagesController( this )
	}

}
