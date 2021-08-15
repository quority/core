import {
	UserRights
} from '../UserRights'

export namespace QueryResponses {
	export namespace QueryItem {
		export interface ApiQuery {
			[ key: string ]: string | string[] | number | undefined
		}

		export interface AllCategories extends ApiQuery {
			category: string
		}

		export interface AllImages extends ApiQuery {
			name: string
			timestamp: string
			url: string
			descriptionurl: string
			descriptionshorturl: string
			ns: number
			title: string
		}

		export interface AllPages extends ApiQuery {
			pageid: number
			ns: number
			title: string
		}

		export interface CategoryMembers extends ApiQuery {
			pageid: number
			ns: number
			title: string
		}

		export interface UserContribs extends ApiQuery {
			userid: number
			user: string
			pageid: number
			revid: number
			parentid: number
			ns: number
			title: string
			timestamp: string
			comment: string
			size: number
		}

		export interface Users extends ApiQuery {
			userid: number
			name: string
			groups: string[]
			rights: UserRights[]
		}
	}

	export interface ApiQuery<Shortname extends string, Name extends string, Item extends QueryItem.ApiQuery> {
		batchcomplete?: boolean
		continue?: {
			[ key in `${ Shortname }continue` ]: string
		}
		query: {
			[ key in Name ]: Item[]
		}
	}

	export type AllCategories = ApiQuery<'ac', 'allcategories', QueryItem.AllCategories>

	export type AllImages = ApiQuery<'ai', 'allimages', QueryItem.AllImages>

	export type AllPages = ApiQuery<'ap', 'allpages', QueryItem.AllPages>

	export type CategoryMembers = ApiQuery<'cm', 'categorymembers', QueryItem.CategoryMembers>

	export type UserContribs = ApiQuery<'uc', 'usercontribs', QueryItem.UserContribs>
}
