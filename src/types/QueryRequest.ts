import {
	RequireOnlyOne
} from './utils'

export namespace MediaWikiQueryRequest {
	export interface QueryRequest {
		action: 'query'
	}

	/**
	 * Options for `list=allcategories`
	 */
	export interface AllCategories extends QueryRequest {
		/**
		 * When more results are available, use this to continue.
		 */
		accontinue?: string

		/**
		 * Direction to sort in.
		 */
		acdir?: 'ascending' | 'descending'

		/**
		 * The category to start enumerating from.
		 */
		acfrom?: string

		/**
		 * How many categories to return.
		 */
		aclimit?: number | 'max'

		/**
		 * Only return categories with at most this many members.
		 */
		acmax?: number

		/**
		 * Only return categories with at least this many members.
		 */
		acmin?: number

		/**
		 * Search for all category titles that begin with this value.
		 */
		acprefix?: string

		/**
		 * Which properties to get.
		 * `size`: Adds number of pages in the category.
		 * `hidden`: Tags categories that are hidden with `__HIDDENCAT__`.
		 */
		acprop?: Array<'size' | 'hidden'>

		/**
		 * The category to stop enumerating at.
		 */
		acto?: string

		list: 'allcategories'
	}

	/**
	 * Options for `list=allimages`
	 */
	export interface AllImages extends QueryRequest {
		/**
		 * When more results are available, use this to continue.
		 */
		aicontinue?: string

		/**
		 * The direction in which to list.
		 */
		aidir?: 'ascending' | 'descending' | 'newer' | 'older'

		/**
		 * The timestamp to end enumerating. Can only be used with aisort=timestamp.
		 */
		aiend?: string

		/**
		 * How to filter files uploaded by bots. Can only be used with `aisort=timestamp`. Cannot be used together with `aiuser`.
		 */
		aifilterbots?: 'all' | 'bots' | 'nobots'

		/**
		 * The image title to start enumerating from. Can only be used with `aisort=name`.
		 */
		aifrom?: string

		/**
		 * How many images in total to return.
		 */
		ailimit?: number | 'max'

		/**
		 * Limit to images with at most this many bytes.
		 */
		aimaxsize?: number

		/**
		 * Limit to images with at least this many bytes.
		 */
		aiminsize?: number

		/**
		 * Search for all image titles that begin with this value. Can only be used with `aisort=name`.
		 */
		aiprefix?: string

		/**
		 * Which file information to get.
		 */
		aiprop?: Array<'timestamp' | 'user' | 'userid' | 'comment' | 'parsedcomment' | 'canonicaltitle' | 'url' | 'size' | 'dimensions' | 'sha1' | 'mime' | 'mediatype' | 'metadata' | 'commonmetadata' | 'extmetadata' | 'bitdepth' | 'badfile'>

		/**
		 * Property to sort by.
		 */
		aisort?: 'name' | 'timestamp'

		/**
		 * The timestamp to start enumerating from. Can only be used with `aisort=timestamp`.
		 */
		aistart?: string

		/**
		 * Only return files uploaded by this user. Can only be used with `aisort=timestamp`. Cannot be used together with `aifilterbots`.
		 */
		aiuser?: string

		list: 'allimages'
	}

	/**
	 * Options for `list=allpages`
	 */
	export interface AllPages extends QueryRequest {
		/**
		 * When more results are available, use this to continue.
		 */
		apcontinue?: string

		/**
		 * Filter based on whether a page has langlinks. Note that this may not consider langlinks added by extensions.
		 * @default 'all'
		 */
		apfilterlanglinks?: 'all' | 'withlanglinks' | 'withoutlanglinks'

		/**
		 * Which pages to list. \
		 * Due to miser mode, using this may result in fewer than aplimit results returned before continuing; in extreme cases, zero results may be returned.
		 * @default 'all'
		 */
		apfilterredir?: 'all' | 'nonredirects' | 'redirects'

		/**
		 * The page title to start enumerating from.
		 */
		apfrom?: string

		/**
		 * How many total pages to return.
		 */
		aplimit?: number | 'max'

		/**
		 * Limit to pages with at most this many bytes.
		 */
		apmaxsize?: number

		/**
		 * Limit to pages with at least this many bytes.
		 */
		apminsize?: number

		/**
		 * The namespace to enumerate.
		 */
		apnamespace?: number | number[]

		/**
		 * Search for all page titles that begin with this value.
		 */
		apprefix?: string

		/**
		 *     The page title to stop enumerating at.
		 */
		apto?: string

		list: 'allpages'
	}

	interface CategoryMembersBase extends QueryRequest {
		/**
		 * When more results are available, use this to continue.
		 */
		cmcontinue?: string

		/**
		 * In which direction to sort.
		 */
		cmdir?: 'ascending' | 'descending' | 'newer' | 'older'

		/**
		 * Timestamp to end listing at. Can only be used with `cmsort=timestamp`.
		 */
		cmend?: string

		/**
		 * The maximum number of pages to return.
		 */
		cmlimit?: number | 'max'

		/**
		 * Only include pages in these namespaces. Note that `cmtype=subcat` or `cmtype=file` may be used instead of `cmnamespace=14` or `6`. \
		 * Due to miser mode, using this may result in fewer than cmlimit results returned before continuing; in extreme cases, zero results may be returned.
		 */
		cmnamespace?: number | number[]

		/**
		 * Page ID of the category to enumerate.
		 */
		cmpageid: number

		/**
		 * Which pieces of information to include.
		 */
		cmprop?: Array<'ids' | 'title' | 'sortkey' | 'sortkeyprefix' | 'type' | 'timestamp'>

		/**
		 * Property to sort by.
		 */
		cmsort?: 'sortkey' | 'timestamp'

		/**
		 * Timestamp to start listing from. Can only be used with `cmsort=timestamp`.
		 */
		cmstart?: string

		/**
		 * Which category to enumerate (required). Must include the `Category:` prefix.
		 */
		cmtitle: string

		/**
		 * Which type of category members to include. Ignored when `cmsort=timestamp` is set.
		 */
		cmtype?: Array<'file' | 'page' | 'subcat'>

		list: 'categorymembers'
	}

	/**
	 * Options for `list=categorymembers`
	 */
	export type CategoryMembers = RequireOnlyOne<CategoryMembersBase, 'cmpageid' | 'cmtitle'>

	/**
	 * Options for `list=logevents`
	 */
	export interface LogEvents extends QueryRequest {
		/**
		 * Filter log actions to only this action. Overrides `letype`. In the list of possible values, values with the asterisk wildcard such as `action/*` can have different strings after the slash (/).
		 */
		leaction?: 'abusefilter/create' | 'abusefilter/hit' | 'abusefilter/modify' | 'abusefilterprivatedetails/access' | 'block/block' | 'block/reblock' | 'block/unblock' | 'contentmodel/change' | 'contentmodel/new' | 'create/create' | 'delete/delete' | 'delete/delete_redir' | 'delete/delete_redir2' | 'delete/event' | 'delete/flow-delete-post' | 'delete/flow-delete-topic' | 'delete/flow-restore-post' | 'delete/flow-restore-topic' | 'delete/restore' | 'delete/revision' | 'gblblock/dwhitelist' | 'gblblock/gblock' | 'gblblock/gblock2' | 'gblblock/gunblock' | 'gblblock/modify' | 'gblblock/whitelist' | 'gblrename/merge' | 'gblrename/promote' | 'gblrename/rename' | 'gblrights/deleteset' | 'gblrights/groupperms' | 'gblrights/groupprms2' | 'gblrights/groupprms3' | 'gblrights/grouprename' | 'gblrights/newset' | 'gblrights/setchange' | 'gblrights/setnewtype' | 'gblrights/setrename' | 'gblrights/usergroups' | 'globalauth/delete' | 'globalauth/hide' | 'globalauth/lock' | 'globalauth/lockandhid' | 'globalauth/setstatus' | 'globalauth/unhide' | 'globalauth/unlock' | 'import/interwiki' | 'import/lqt-to-flow-topic' | 'import/upload' | 'interwiki/*' | 'liquidthreads/merge' | 'liquidthreads/move' | 'liquidthreads/resort' | 'liquidthreads/signatureedit' | 'liquidthreads/split' | 'liquidthreads/subjectedit' | 'lock/flow-lock-topic' | 'lock/flow-restore-topic' | 'managetags/activate' | 'managetags/create' | 'managetags/deactivate' | 'managetags/delete' | 'massmessage/*' | 'massmessage/failure' | 'massmessage/send' | 'massmessage/skipbadns' | 'massmessage/skipnouser' | 'massmessage/skipoptout' | 'merge/merge' | 'move/move' | 'move/move_redir' | 'newsletter/*' | 'newusers/autocreate' | 'newusers/byemail' | 'newusers/create' | 'newusers/create2' | 'newusers/forcecreatelocal' | 'newusers/newusers' | 'notifytranslators/sent' | 'oath/*' | 'pagelang/pagelang' | 'pagetranslation/associate' | 'pagetranslation/deletefnok' | 'pagetranslation/deletefok' | 'pagetranslation/deletelnok' | 'pagetranslation/deletelok' | 'pagetranslation/discourage' | 'pagetranslation/dissociate' | 'pagetranslation/encourage' | 'pagetranslation/mark' | 'pagetranslation/movenok' | 'pagetranslation/moveok' | 'pagetranslation/prioritylanguages' | 'pagetranslation/unmark' | 'patrol/autopatrol' | 'patrol/patrol' | 'protect/modify' | 'protect/move_prot' | 'protect/protect' | 'protect/unprotect' | 'renameuser/renameuser' | 'rights/autopromote' | 'rights/blockautopromote' | 'rights/restoreautopromote' | 'rights/rights' | 'spamblacklist/*' | 'suppress/block' | 'suppress/cadelete' | 'suppress/delete' | 'suppress/event' | 'suppress/flow-restore-post' | 'suppress/flow-restore-topic' | 'suppress/flow-suppress-post' | 'suppress/flow-suppress-topic' | 'suppress/hide-afl' | 'suppress/reblock' | 'suppress/revision' | 'suppress/setstatus' | 'suppress/unhide-afl' | 'tag/update' | 'thanks/*' | 'timedmediahandler/resettranscode' | 'titleblacklist/*' | 'translationreview/group' | 'translationreview/message' | 'upload/overwrite' | 'upload/revert' | 'upload/upload' | 'urlshortener/*' | 'usermerge/*'

		/**
		 * In which direction to enumerate.
		 */
		ledir?: 'newer' | 'older'

		/**
		 * The timestamp to end enumerating.
		 */
		leend?: string

		/**
		 * How many total event entries to return.
		 */
		lelimit?: number | 'max'

		/**
		 * Filter entries to those in the given namespace.
		 */
		lenamespace?: number

		/**
		 * Which properties to get.
		 */
		leprop?: Array<'ids' | 'title' | 'type' | 'user' | 'userid' | 'timestamp' | 'comment' | 'details' | 'tags'>

		/**
		 * The timestamp to start enumerating from.
		 */
		lestart?: string

		/**
		 * Filter entries to those related to a page.
		 */
		letitle?: string

		/**
		 * Filter log entries to only this type.
		 */
		letype?: 'abusefilter' | 'abusefilterprivatedetails' | 'block' | 'contentmodel' | 'create' | 'delete' | 'gblblock' | 'gblrename' | 'gblrights' | 'globalauth' | 'import' | 'liquidthreads' | 'managetags' | 'massmessage' | 'merge' | 'move' | 'newsletter' | 'newusers' | 'notifytranslators' | 'oath' | 'pagelang' | 'pagetranslation' | 'patrol' | 'protect' | 'renameuser' | 'rights' | 'spamblacklist' | 'suppress' | 'tag' | 'thanks' | 'timedmediahandler' | 'titleblacklist' | 'translationreview' | 'upload' | 'urlshortener' | 'usermerge'

		/**
		 * Filter entries to those made by the given user.
		 */
		leuser?: string

		list: 'logevents'
	}

	/**
	 * Options for `list=recentchanges`
	 */
	export interface RecentChanges extends QueryRequest {
		list: 'recentchanges'

		/**
		 * In which direction to enumerate.
		 */
		rcdir?: 'newer' | 'older'

		/**
		 * The timestamp to end enumerating.
		 */
		rcend?: string

		/**
		 * Don't list changes by this user.
		 */
		rcexcludeuser?: string

		/**
		 * How many total changes to return.
		 */
		rclimit?: number | 'max'

		/**
		 * Filter changes to only these namespaces.
		 */
		rcnamespace?: '*' | number | number[]

		/**
		 * Include additional pieces of information.
		 */
		rcprop?: Array<'user' | 'userid' | 'comment' | 'flags' | 'timestamp' | 'title' | 'ids' | 'sizes' | 'redirect' | 'patrolled' | 'loginfo' | 'tags'>

		/**
		 * Show only items that meet these criteria.
		 */
		rcshow?: Array<'!anon' | '!autropatrolled' | '!bot' | '!minor' | '!patrolled' | '!redirect' | 'anon' | 'autopatrolled' | 'bot' | 'minor' | 'patrolled' | 'redirect' | 'unpatrolled'>

		/**
		 * The timestamp to start enumerating from.
		 */
		rcstart?: string

		/**
		 * Only list changes by this user.
		 */
		rcuser?: string

		/**
		 * Filter entries to those related to a page.
		 */
		rctitle?: string

		/**
		 * Only list changes which are the latest revision.
		 */
		rctoponly?: boolean

		/**
		 * Which types of changes to show.
		 */
		rctype?: Array<'edit' | 'new' | 'log' | 'categorize'>
	}

	interface UserContribsBase extends QueryRequest {
		list: 'usercontribs'

		/**
		 * When more results are available, use this to continue.
		 */
		uccontinue?: string

		/**
		 * In which direction to enumerate.
		 */
		ucdir?: 'newer' | 'older'

		/**
		 * The end timestamp to return to, i.e. revisions after this timestamp.
		 */
		ucend?: string

		/**
		 * The maximum number of contributions to return.
		 */
		uclimit?: number | 'max'

		/**
		 * Only list contributions in these namespaces.
		 */
		ucnamespace?: number | number[]

		/**
		 * Include additional pieces of information.
		 */
		ucprop?: Array<'ids' | 'title' | 'timestamp' | 'comment' | 'parsedcomment' | 'size' | 'sizediff' | 'flags' | 'patrolled' | 'tags'>

		/**
		 * Show only items that meet these criteria.
		 */
		ucshow?: Array< '!autopatrolled' | '!minor' | '!new' | '!patrolled' | '!top' | 'autopatrolled' | 'minor' | 'new' | 'patrolled' | 'top' >

		/**
		 * The start timestamp to return from, i.e. revisions before this timestamp.
		 */
		ucstart?: string

		/**
		 * Only list revisions tagged with this tag.
		 */
		uctag?: string

		/**
		 * The users to retrieve contributions for.
		 */
		ucuser: string | string[]

		/**
		 * The user IDs to retrieve contributions for.
		 */
		ucuserids: number | number[]

		/**
		 * Retrieve contributions for all users whose names begin with this value.
		 */
		ucuserprefix: string
	}

	/**
	 * Options for `list=usercontribs`
	 */
	export type UserContribs = RequireOnlyOne<UserContribsBase, 'ucuser' | 'ucuserids' | 'ucuserprefix'>

	interface UsersBase extends QueryRequest {
		list: 'users'

		/**
		 * Which pieces of information to include.
		 */
		usprop?: Array<'blockinfo' | 'groups' | 'groupmemberships' | 'implicitgroups' | 'rights' | 'editcount' | 'registration' | 'emailable' | 'gender' | 'centralids' | 'cancreate'>

		/**
		 * A list of users to obtain information for.
		 */
		ususers: string | string[]

		/**
		 * A list of user IDs to obtain information for.
		 */
		ususerids: number | number[]
	}

	/**
	 * Options for `list=users`
	 */
	export type Users = RequireOnlyOne<UsersBase, 'ususers' | 'ususerids'>
}
