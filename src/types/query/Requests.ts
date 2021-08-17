export namespace QueryRequests {
	export interface ApiQuery {
		[ key: string ]: string | string[] | number | number[] | boolean | undefined
	}

	export interface AllCategories extends ApiQuery {
		acfrom?: string
		accontinue?: string
		acto?: string
		acprefix?: string
		acdir?: 'ascending' | 'descending'
		acmin?: number
		acmax?: number
		aclimit?: number | 'max'
		acprop?: Array<'size' | 'hidden'>
	}

	export interface AllImages extends ApiQuery {
		aisort?: 'name' | 'timestamp'
		aidir?: 'ascending' | 'descending' | 'newer' | 'older'
		aifrom?: string
		aicontinue?: string
		aistart?: string
		aiend?: string
		aiprop?: Array<'timestamp' | 'user' | 'userid' | 'comment' | 'parsedcomment' | 'canonicaltitle' | 'url' | 'size' | 'dimensions' | 'sha1' | 'mime' | 'mediatype' | 'metadata' | 'commonmetadata' | 'extmetadata' | 'bitdepth' | 'badfile'>
		aiprefix?: string
		aiminsize?: number
		aimaxsize?: number
		aiuser?: string
		aifilterbots?: 'all' | 'bots' | 'nobots'
		ailimit?: number | 'max'
	}

	export interface AllPages extends ApiQuery {
		apfrom?: string
		apcontinue?: string
		apto?: string
		apprefix?: string
		apnamespace?: number | string
		apfilterredir?: 'all' | 'nonredirects' | 'redirects'
		apminsize?: number
		apmaxsize?: number
		aplimit?: number | 'max'
		apfilterlanglinks?: 'all' | 'withlanglinks' | 'withoutlanglinks'
	}

	export interface CategoryMembers extends ApiQuery {
		cmtitle?: string
		cmnamespace?: number | string
		cmtype?: string
		cmcontinue?: string
		cmlimit?: number | 'max'
		cmsort?: 'sortkey' | 'timestamp'
		cmdir?: 'ascending' | 'descending' | 'newer' | 'older'
		cmstart?: string
		cmend?: string
	}

	export interface RecentChanges extends ApiQuery {
		rcstart?: string
		rcend?: string
		rcdir?: 'newer' | 'older'
		rcnamespace?: '*' | number | number[]
		rcuser?: string
		rcexcludeuser?: string
		rcprop?: Array<'user' | 'userid' | 'comment' | 'flags' | 'timestamp' | 'title' | 'ids' | 'sizes' | 'redirect' | 'patrolled' | 'loginfo' | 'tags'>
		rcshow?: Array<'!anon' | '!autropatrolled' | '!bot' | '!minor' | '!patrolled' | '!redirect' | 'anon' | 'autopatrolled' | 'bot' | 'minor' | 'patrolled' | 'redirect' | 'unpatrolled'>
		rclimit?: number | 'max'
		rctype?: Array<'edit' | 'new' | 'log' | 'categorize'>
		rctoponly?: boolean
		rctitle?: string
	}

	export interface UserContribs extends ApiQuery {
		uclimit?: number | 'max'
		ucstart?: string
		ucend?: string
		uccontinue?: string
		ucuser: string
		ucdir?: 'newer' | 'older'
		ucnamespace?: number | number[]
		ucprop?: Array<'ids' | 'title' | 'timestamp' | 'comment' | 'parsedcomment' | 'size' | 'sizediff' | 'flags' | 'patrolled' | 'tags'>
		ucshow?: Array< '!autopatrolled' | '!minor' | '!new' | '!patrolled' | '!top' | 'autopatrolled' | 'minor' | 'new' | 'patrolled' | 'top' >
		uctag?: string
	}

	export interface Users extends ApiQuery {
		usprop?: Array<'blockinfo' | 'groups' | 'groupmemberships' | 'implicitgroups' | 'rights' | 'editcount' | 'registration' | 'emailable' | 'gender' | 'centralids' | 'cancreate'>
		ususers: string | string[]
	}
}
