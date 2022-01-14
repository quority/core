import type {
	MediaWikiQueryItem
} from './QueryItem'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MediaWikiQueryResponses {
	export interface QueryResponse<Shortname extends string, Name extends string, Item extends MediaWikiQueryItem.QueryItem> {
		batchcomplete?: boolean
		continue?: {
			[ key in `${ Shortname }continue` ]: string
		}
		query: {
			[ key in Name ]: Item[]
		}
	}

	export type AllCategories = QueryResponse<'ac', 'allcategories', MediaWikiQueryItem.AllCategories>

	export type AllImages = QueryResponse<'ai', 'allimages', MediaWikiQueryItem.AllImages>

	export type AllPages = QueryResponse<'ap', 'allpages', MediaWikiQueryItem.AllPages>

	export type CategoryMembers = QueryResponse<'cm', 'categorymembers', MediaWikiQueryItem.CategoryMembers>

	export type LogEvents = QueryResponse<'le', 'logevents', MediaWikiQueryItem.LogEvents>

	export type RecentChanges = QueryResponse<'rc', 'recentchanges', MediaWikiQueryItem.RecentChanges>

	export type UserContribs = QueryResponse<'uc', 'usercontribs', MediaWikiQueryItem.UserContribs>

	export type Users = QueryResponse<'us', 'users', MediaWikiQueryItem.Users>
}
