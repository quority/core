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
	categories: [ Query.CategoriesRequest, Query.CategoriesResponse, Query.CategoriesItem ]
	categoryinfo: [ Query.CategoryInfoRequest, Query.CategoryInfoResponse, Query.CategoriesItem ]
	contributors: [ Query.ContributorsRequest, Query.ContributorsResponse, Query.ContributorsItem ]
	deletedrevisions: [ Query.DeletedRevisionsRequest, Query.DeletedRevisionsResponse, Query.DeletedRevisionsItem ]
	duplicatefiles: [ Query.DuplicateFilesRequest, Query.DuplicateFilesResponse, Query.DuplicateFilesItem ]
	extlinks: [ Query.ExtLinksRequest, Query.ExtLinksResponse, Query.ExtLinksItem ]
	fileusage: [ Query.FileUsageRequest, Query.FileUsageResponse, Query.FileUsageItem ]
	imageinfo: [ Query.ImageInfoRequest, Query.ImageInfoResponse, Query.ImageInfoItem ]
	images: [ Query.ImagesRequest, Query.ImagesResponse, Query.ImagesItem ]
	info: [ Query.InfoRequest, Query.InfoResponse, Query.InfoItem ]
	iwlinks: [ Query.IwLinksRequest, Query.IwLinksResponse, Query.IwLinksItem ]
	langlinks: [ Query.LangLinksRequest, Query.LangLinksResponse, Query.LangLinksItem ]
	links: [ Query.LinksRequest, Query.LinksResponse, Query.LinksItem ]
	linkshere: [ Query.LinksHereRequest, Query.LinksHereResponse, Query.LinksHereItem ]
	redirects: [ Query.RedirectsRequest, Query.RedirectsResponse, Query.RedirectsItem ]
	revisions: [ Query.RevisionsRequest, Query.RevisionsResponse, Query.RevisionsItem ]
	templates: [ Query.TemplatesRequest, Query.TemplatesResponse, Query.TemplatesItem ]
	transcludedin: [ Query.TranscludedInRequest, Query.TranscludedInResponse, Query.TranscludedInItem ]
}

export type AllQuery = ListQuery & MetaQuery & PropQuery
