export namespace MediaWikiQueryItem {
	export interface QueryItem {
	}

	export interface AllCategories extends QueryItem {
		category: string
	}

	export interface AllImages extends QueryItem {
		name: string
		timestamp: string
		url: string
		descriptionurl: string
		descriptionshorturl: string
		ns: number
		title: string
	}

	export interface AllPages extends QueryItem {
		pageid: number
		ns: number
		title: string
	}

	export interface CategoryMembers extends QueryItem {
		pageid: number
		ns: number
		title: string
	}

	export interface LogEvents extends QueryItem {
		action: string
		comment: string
		logid: number
		logpage: number
		ns: number
		pageid: number
		timestamp: string
		title: string
		type: string
		user: string
	}

	export interface RecentChanges extends QueryItem {
		type: string
		ns: number
		title: string
		pageid: number
		revid: number
		old_revid: number
		rcid: number
		user: string
		oldlen: number
		newlen: number
	}

	export interface UserContribs extends QueryItem {
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

	export interface Users extends QueryItem {
		userid: number
		name: string
		groups: string[]
		rights: string[]
	}
}
