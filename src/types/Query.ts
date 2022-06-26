import type * as Query from './queries'

export interface ListQuery {
	allcategories: [ Query.AllCategoriesRequest, Query.AllCategoriesResponse, Query.AllCategoriesItem ]
	allimages: [ Query.AllImagesRequest, Query.AllImagesResponse, Query.AllImagesItem ]
	allpages: [ Query.AllPagesRequest, Query.AllPagesResponse, Query.AllPagesItem ]
	categorymembers: [ Query.CategoryMembersRequest, Query.CategoryMembersResponse, Query.CategoryMembersItem ]
	logevents: [ Query.LogEventsRequest, Query.LogEventsResponse, Query.LogEventsItem ]
	recentchanges: [ Query.RecentChangesRequest, Query.RecentChangesResponse, Query.RecentChangesItem ]
	usercontribs: [ Query.UserContribsRequest, Query.UserContribsResponse, Query.UserContribsItem ]
	users: [ Query.UsersRequest, Query.UsersResponse, Query.UsersItem ]
}

export interface MetaQuery {
	allmessages: [ Query.AllMessagesRequest, Query.AllMessagesResponse ]
	filerepoinfo: [ Query.FileRepoInfoRequest, Query.FileRepoInfoResponse ]
	siteinfo: [ Query.SiteInfoRequest, Query.SiteInfoResponse ]
	tokens: [ Query.TokensRequest, Query.TokensResponse ]
}

export interface PropQuery {
	info: [ Query.InfoRequest, Query.InfoResponse, Query.InfoItem ]
	linkshere: [ Query.LinksHereRequest, Query.LinksHereResponse, Query.LinksHereItem ]
	revisions: [ Query.RevisionsRequest, Query.RevisionsResponse, Query.RevisionsItem ]
	transcludedin: [ Query.TranscludedInRequest, Query.TranscludedInResponse, Query.TranscludedInItem ]
}

export type AllQuery = ListQuery & MetaQuery & PropQuery
