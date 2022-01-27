/* eslint-disable @typescript-eslint/no-empty-interface */
import type { ReadStream } from 'fs'

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
	Pick<T, Exclude<keyof T, Keys>>
	& {
		[K in Keys]-?:
			Required<Pick<T, K>>
			& Partial<Record<Exclude<Keys, K>, undefined>>
	}[Keys]

export type MaybeArray<T> = T | T[]

export interface APIError {
	error: {
		code: string
		info: string
	}
}

export type RequestParameterType = string | number | boolean | string[] | number[] | undefined

export type TokenType = 'createaccount' | 'csrf' | 'deleteglobalaccount' | 'login' | 'patrol' | 'rollback' | 'setglobalaccountstatus' | 'userrights' | 'watch'

export interface Request {
}

export interface GETRequest extends Request {
	//[ key: string ]: RequestParameterType
}

export interface POSTRequest extends Request {
	//[ key: string ]: RequestParameterType | ReadStream
}


export type JSONRequest<T extends Request> = T & {
	format: 'json'
	formatversion: 2
}

export type ExtendedRequest<T extends Request> = T & {
	action?: string
	assert?: 'bot' | 'user'
	meta?: string
	prop?: string
	token?: string
}

export type NoActionToken<T> = Omit<T, 'action' | 'token'>

export interface QueryRequest extends Request {
	action: 'query'
}

export interface Response {
}

export interface QueryResponse {
	batchcomplete?: boolean
}

export interface ListQueryResponse<Shortname extends string = string, Name extends string = string, QueryItem = Record<string, unknown>> extends QueryResponse {
	continue?: {
		[ key in `${ Shortname }continue` ]: string
	}
	query: {
		[ key in Name ]: QueryItem[]
	}
}

/**
 * Options for `meta=allmessages`.
 */
export interface AllMessagesRequest extends QueryRequest {
	/**
	 * Arguments to be substituted into message.
	 */
	amargs?: string | string[]

	/**
	 * Return only messages in this customisation state.
	 * @default 'all'
	 */
	amcustomised?: 'all' | 'modified' | 'unmodified'

	/**
	 * Set to enable parser, will preprocess the wikitext of message (substitute magic words, handle templates, etc.).
	 */
	amenableparser?: boolean

	/**
	 * Return only messages with names that contain this string.
	 */
	amfilter?: string

	/**
	 * Return messages starting at this message.
	 */
	amfrom?: string

	/**
	 * Return messages in this language.
	 */
	amlang?: string

	/**
	 * Which messages to output.
	 * @default '*'
	 */
	ammessages: string | string[]

	/**
	 * Also include local messages, i.e. messages that don't exist in the software but do exist as in the MediaWiki namespace. \
	 * This lists all MediaWiki-namespace pages, so it will also list those that aren't really messages such as Common.js.
	 */
	amincludelocal?: boolean

	/**
	 * If set, do not include the content of the messages in the output.
	 */
	amnocontent?: boolean

	/**
	 * Return messages with this prefix.
	 */
	amprefix?: string

	/**
	 * Page name to use as context when parsing message (for amenableparser option).
	 */
	amtitle?: string

	/**
	 * Return messages ending at this message.
	 */
	amto?: string

	meta: 'allmessages'
}

/**
 * Options for `meta=filerepoinfo`.
 */
export interface FileRepoInfoRequest extends QueryRequest {
	/**
	 * Which repository properties to get (properties available may vary on other wikis). \
	 * \
	 * Available default options: `canUpload`, `descBaseUrl`, `descriptionCacheExpiry`, `displayname`, `favicon`, `fetchDescription`, `initialCapital`, `local`, `name`, `rootUrl`, `scriptDirUrl`, `thumbUrl`, `url`.
	 */
	friprop: string | string[]

	meta: 'filerepoinfo'
}

export interface RevisionsRequest extends QueryRequest {
	prop: 'revisions'

	/**
	 * When more results are available, use this to continue.
	 */
	rvcontinue?: string

	/**
	 * In which direction to enumerate.
	 */
	rvdir?: 'newer' | 'older'

	/**
	 * Enumerate up to this timestamp.
	 */
	rvend?: string

	/**
	 * Stop enumeration at this revision's timestamp. The revision must exist, but need not belong to this page.
	 */
	rvendid?: number

	/**
	 * Exclude revisions made by user.
	 */
	rvexcludeuser?: string

	/**
	 * Limit how many revisions will be returned.
	 */
	rvlimit?: number | 'max'

	/**
	 * Which properties to get for each revision.
	 */
	rvprop?: MaybeArray<'ids' | 'flags' | 'timestamp' | 'user' | 'userid' | 'size' | 'slotsize' | 'sha1' | 'slotsha1' | 'contentmodel' | 'comment' | 'parsedcomment' | 'content' | 'tags' | 'roles'>

	/**
	 * Which revision slots to return data for, when slot-related properties are included in rvprops. If omitted, data from the main slot will be returned in a backwards-compatible format.
	 */
	rvslots?: 'main' | '*'

	/**
	 * From which revision timestamp to start enumeration.
	 */
	rvstart?: string

	/**
	 * Start enumeration from this revision's timestamp. The revision must exist, but need not belong to this page.
	 */
	rvstartid?: number

	/**
	 * Only list revisions tagged with this tag.
	 */
	rvtag?: string

	/**
	 * Only include revisions made by user.
	 */
	rvuser?: string

	titles: string | string[]
}

/**
 * Options for `meta=siteinfo`.
 */
export interface SiteInfoRequest extends QueryRequest {
	meta: 'siteinfo'

	/**
	 * Return only local or only nonlocal entries of the interwiki map.
	 */
	sifilteriw?: 'local' | '!local'

	/**
	 * Language code for localised language names (best effort) and skin names.
	 */
	siinlanguagecode?: string

	/**
	 * Lists the number of users in user groups.
	 */
	sinumberingroup?: boolean

	/**
	 * Which information to get.
	 */
	siprop: MaybeArray<'general' | 'namespaces' | 'namespacealiases' | 'specialpagealiases' | 'magicwords' | 'interwikimap' | 'dbrepllag' | 'statistics' | 'usergroups' | 'libraries' | 'extensions' | 'fileextensions' | 'rightsinfo' | 'restrictions' | 'languages' | 'languagevariants' | 'skins' | 'extensiontags' | 'functionhooks' | 'showhooks' | 'variables' | 'protocols' | 'defaultoptions' | 'uploaddialog'>

	/**
	 * List all database servers, not just the one lagging the most.
	 */
	sishowalldb?: boolean
}

/**
 * Options for `meta=tokens`.
 */
export interface TokensRequest extends QueryRequest {
	meta: 'tokens'

	/**
	 * Types of token to request.
	 */
	type: MaybeArray<TokenType>
}

/**
 * Options to block an user.
 */
export interface BlockRequest extends POSTRequest {
	/**
	 * Allow the user to edit their own talk page.
	 */
	allowusertalk?: boolean

	/**
	 * Block anonymous users only (i.e. disable anonymous edits for this IP address).
	 */
	anononly?: boolean

	/**
	 * Automatically block the last used IP address, and any subsequent IP addresses they try to login from.
	 */
	autoblock?: boolean

	/**
	 * Expiry time. May be relative (e.g. `5 months` or `2 weeks`) or absolute (e.g. `2014-09-18T12:34:56Z`). If set to `infinite`, `indefinite`, or `never`, the block will never expire.
	 * @default `never`
	 */
	expiry?: string

	/**
	 * Prevent account creation.
	 */
	nocreate?: boolean

	/**
	 * Prevent user from sending email through the wiki. (Requires the `blockemail` right).
	 */
	noemail?: boolean

	/**
	 * If the user is already blocked, overwrite the existing block.
	 */
	reblock?: boolean

	/**
	 * Reason for block.
	 */
	reason?: string

	/**
	 * User to block.
	 */
	user: string
}

interface BaseDeleteRequest extends POSTRequest {
	/**
	 * Page ID of the page to delete.
	 */
	pageid: number

	/**
	 * Reason for the deletion. If not set, an automatically generated reason will be used.
	 */
	reason?: string

	/**
	 * Title of the page to delete.
	 */
	title: string
}

/**
 * Options to delete a page.
 */
export type DeleteRequest = RequireOnlyOne<BaseDeleteRequest, 'title' | 'pageid'>

interface BaseEditRequest extends POSTRequest {
	/**
	 * Add this text to the end of the page.
	 */
	appendtext?: string

	/**
	 * Mark this edit as a bot edit.
	 */
	bot?: boolean

	/**
	 * Don't edit the page if it exists already.
	 */
	createonly?: boolean

	/**
	 * Mark this edit as a minor edit.
	 */
	minor?: boolean

	/**
	 * Throw an error if the page doesn't exist.
	 */
	nocreate?: boolean

	/**
	 * Do not mark this edit as a minor edit even if the "Mark all edits minor by default" user preference is set.
	 */
	notminor?: boolean

	/**
	 * Page ID of the page to edit.
	 */
	pageid?: number

	/**
	 * Add this text to the beginning of the page.
	 */
	prependtext?: string

	/**
	 * Override any errors about the page having been deleted in the meantime.
	 */
	recreate?: boolean

	/**
	 * Page content.
	 */
	text: string

	/**
	 * Title of the page to edit.
	 */
	title?: string

	/**
	 * Undo this revision. The value must be no less than 0.
	 */
	undo?: number

	/**
	 * Undo all revisions from undo to this one. If not set, just undo one revision. The value must be no less than 0.
	 */
	undoafter?: number

	/**
	 * Edit summary.
	 */
	summary?: string
}

/**
 * Options to edit a page.
 */
export type EditRequest = RequireOnlyOne<BaseEditRequest, 'title' | 'pageid'>

export interface LoginRequest extends POSTRequest {
	/**
	 * User name.
	 */
	lgname: string

	/**
	 * Password.
	 */
	lgpassword: string

	/**
	 * A "login" token.
	 */
	lgtoken: string
}

interface BaseMoveRequest extends POSTRequest {
	/**
	 * Title of the page to rename.
	 */
	from: string

	/**
	 * Page ID of the page to rename.
	 */
	fromid: number

	/**
	 * Ignore any warnings.
	 */
	ignorewarnings?: boolean

	/**
	 * Rename subpages, if applicable.
	 */
	movesubpages?: boolean

	/**
	 * Rename the talk page, if it exists.
	 */
	movetalk?: boolean

	/**
	 * Don't create a redirect.
	 * @default false
	 */
	noredirect?: boolean

	/**
	 * Reason for the rename.
	 */
	reason?: string

	/**
	 * Title to rename the page to.
	 */
	to: string
}

/**
 * Options to move a page.
 */
export type MoveRequest = RequireOnlyOne<BaseMoveRequest, 'from' | 'fromid'>

export type ProtectionAction = 'edit' | 'move'
export type ProtectionLevel = 'all' | 'autoconfirmed' | 'sysop'

interface BaseProtectRequest<Action extends string = ProtectionAction, Level extends string = ProtectionLevel> extends POSTRequest {
	/**
	 * Enable cascading protection (i.e. protect transcluded templates and images used in this page). Ignored if none of the given protection levels support cascading.
	 */
	cascade?: boolean

	/**
	 * Expiry timestamps. If only one timestamp is set, it'll be used for all protections. Use infinite, `indefinite`, `infinity`, or `never`, for a never-expiring protection.
	 */
	expiry?: string

	/**
	 * ID of the page to (un)protect.
	 */
	pageid: number

	/**
	 * List of protection levels, formatted `action=level` (e.g. `edit=sysop`). A level of all means everyone is allowed to take the action, i.e. no restriction.
	 * Note: Any actions not listed will have restrictions removed.
	 */
	protections: MaybeArray<`${ Action }=${ Level }`> | ''

	/**
	 * Reason for (un)protecting.
	 */
	reason?: string

	/**
	 * Title of the page to (un)protect. Cannot be used together with pageid.
	 */
	title: string
}

/**
 * Options to protect a page.
 */
export type ProtectRequest<Action extends string = ProtectionAction, Level extends string = ProtectionLevel> = RequireOnlyOne<BaseProtectRequest<Action, Level>, 'title' | 'pageid'>

interface BasePurgeRequest extends POSTRequest {
	/**
	 * When more results are available, use this to continue.
	 */
	continue?: string

	/**
	 * Convert titles to other variants if necessary. Only works if the wiki's content language supports variant conversion. Languages that support variant conversion include ban, en, crh, gan, iu, kk, ku, shi, sr, tg, uz and zh.
	 */
	converttitles?: boolean

	/**
	 * Update the links tables and do other secondary data updates.
	 */
	forcelinkupdate?: boolean

	/**
	 * Same as `forcelinkupdate`, and update the links tables for any page that uses this page as a template.
	 */
	forcerecursivelinkupdate?: boolean

	/**
	 * A list of page IDs to work on.
	 */
	pageids: number | number[]

	/**
	 * Automatically resolve redirects.
	 */
	redirects?: boolean

	/**
	 * A list of revision IDs to work on.
	 */
	revids: number | number[]

	/**
	 * A list of titles to work on.
	 */
	titles: string | string[]
}

/**
 * Options to purge the cache for the given titles.
 */
export type PurgeRequest = RequireOnlyOne<BasePurgeRequest, 'pageids' | 'revids' | 'titles'>

interface BaseUploadRequest extends POSTRequest {
	/**
	 * File contents.
	 */
	file: ReadStream

	/**
	 * Target filename.
	 */
	filename: string

	/**
	 * Ignore any warnings.
	 */
	ignorewarnings?: boolean

	/**
	 * URL to fetch the file from.
	 */
	url: string
}

/**
 * Options to upload a file.
 */
export type UploadRequest = RequireOnlyOne<BaseUploadRequest, 'file' | 'url'>

/**
 * Options for `list=allcategories`
 */
export interface AllCategoriesRequest extends QueryRequest {
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
	acprop?: MaybeArray<'size' | 'hidden'>

	/**
	 * The category to stop enumerating at.
	 */
	acto?: string

	list: 'allcategories'
}

/**
 * Options for `list=allimages`
 */
export interface AllImagesRequest extends QueryRequest {
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
	aiprop?: MaybeArray<'timestamp' | 'user' | 'userid' | 'comment' | 'parsedcomment' | 'canonicaltitle' | 'url' | 'size' | 'dimensions' | 'sha1' | 'mime' | 'mediatype' | 'metadata' | 'commonmetadata' | 'extmetadata' | 'bitdepth' | 'badfile'>

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
export interface AllPagesRequest extends QueryRequest {
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

interface BaseCategoryMembersRequest extends QueryRequest {
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
	cmprop?: MaybeArray<'ids' | 'title' | 'sortkey' | 'sortkeyprefix' | 'type' | 'timestamp'>

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
	cmtype?: MaybeArray<'file' | 'page' | 'subcat'>

	list: 'categorymembers'
}

/**
 * Options for `list=categorymembers`
 */
export type CategoryMembersRequest = RequireOnlyOne<BaseCategoryMembersRequest, 'cmpageid' | 'cmtitle'>

export interface LinksHereRequest extends QueryRequest {
	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	lhcontinue?: string

	/**
	 * How many to return.
	 */
	lhlimit?: number | 'max'

	/**
	 * Only include pages in these namespaces.
	 */
	lhnamespace?: number | number[]

	/**
	 * Which properties to get.
	 */
	lhprop?: MaybeArray<'pageid' | 'title' | 'redirect'>

	/**
	 * Show only items that meet these criteria.
	 */
	lhshow?: 'redirect' | '!redirect'
}

/**
 * Options for `list=logevents`
 */
export interface LogEventsRequest extends QueryRequest {
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
	leprop?: MaybeArray<'ids' | 'title' | 'type' | 'user' | 'userid' | 'timestamp' | 'comment' | 'details' | 'tags'>

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
export interface RecentChangesRequest extends QueryRequest {
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
	rcprop?: MaybeArray<'user' | 'userid' | 'comment' | 'flags' | 'timestamp' | 'title' | 'ids' | 'sizes' | 'redirect' | 'patrolled' | 'loginfo' | 'tags' | 'parsedcomment'>

	/**
	 * Show only items that meet these criteria.
	 */
	rcshow?: MaybeArray<'!anon' | '!autropatrolled' | '!bot' | '!minor' | '!patrolled' | '!redirect' | 'anon' | 'autopatrolled' | 'bot' | 'minor' | 'patrolled' | 'redirect' | 'unpatrolled'>

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
	rctype?: MaybeArray<'edit' | 'new' | 'log' | 'categorize'>
}

export interface TranscludedInRequest extends QueryRequest {
	titles: string | string[]

	/**
	 * When more results are available, use this to continue.
	 */
	ticontinue?: string

	/**
	 * How many to return.
	 */
	tilimit?: number | 'max'

	/**
	 * Only include pages in these namespaces.
	 */
	tinamespace?: number | number[]

	/**
	 * Which properties to get.
	 */
	tiprop?: MaybeArray<'pageid' | 'title' | 'redirect'>

	/**
	 * Show only items that meet these criteria.
	 */
	tishow?: 'redirect' | '!redirect'
}

interface BaseUserContribsRequest extends QueryRequest {
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
	ucprop?: MaybeArray<'ids' | 'title' | 'timestamp' | 'comment' | 'parsedcomment' | 'size' | 'sizediff' | 'flags' | 'patrolled' | 'tags'>

	/**
	 * Show only items that meet these criteria.
	 */
	ucshow?: MaybeArray< '!autopatrolled' | '!minor' | '!new' | '!patrolled' | '!top' | 'autopatrolled' | 'minor' | 'new' | 'patrolled' | 'top' >

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
export type UserContribsRequest = RequireOnlyOne<BaseUserContribsRequest, 'ucuser' | 'ucuserids' | 'ucuserprefix'>

interface BaseUsersRequest extends QueryRequest {
	list: 'users'

	/**
	 * Which pieces of information to include.
	 */
	usprop?: MaybeArray<'blockinfo' | 'groups' | 'groupmemberships' | 'implicitgroups' | 'rights' | 'editcount' | 'registration' | 'emailable' | 'gender' | 'centralids' | 'cancreate'>

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
export type UsersRequest = RequireOnlyOne<BaseUsersRequest, 'ususers' | 'ususerids'>

export interface AllMessagesResponse extends QueryResponse {
	query: {
		allmessages: Array<{
			name: string
			normalizedname: string
			'*': string
		}>
	}
}

export interface FileRepoInfoResponse extends QueryResponse {
	query: {
		repos: Array<{
			displayname: string
			name: string
			url: string
		}>
	}
}

export interface SiteInfoResponse extends QueryResponse {
	query: {
		dbrepllag: Array<{
			host: string
			lag: number
		}>
		defaultoptions: Record<string, unknown>
		extensions: Array<{
			author: string
			descriptionmsg: string
			license: string
			'license-name': string
			name: string
			type: string
			url: string
			version: string
		}>
		extensiontags: string[]
		fileextensions: Array<{
			ext: string
		}>
		functionhooks: string[]
		general: {
			allunicodefixes: boolean
			articlepath: string
			base: string
			case: string
			dbtype: string
			dbversion: string
			externalimages: string[]
			favicon: string
			generator: string
			imagewhitelistenabled: boolean
			invalidusernamechars: string
			lang: string
			langconversion: boolean
			legaltitlechars: string
			linktrail: string
			logo: string
			mainpage: string
			maxarticlesize: number
			maxuploadsize: number
			minuploadchunksize: number
			misermode: boolean
			phpversion: string
			readonly: boolean
			script: string
			scriptpath: string
			server: string
			servername: string
			sitename: string
			timezone: string
			titleconversion: boolean
			uploadsenabled: boolean
			wikiid: string
			writeapi: boolean
		}
		interwikimap: Array<{
			api?: string
			local?: boolean
			prefix: string
			url: string
			wikiid?: string
		} | {
			language: string
			local: true
			prefix: string
			url: string
		}>
		languages: Array<{
			bcp47: string
			code: string
			name: string
		}>
		languagevariants: Record<string, unknown>
		libraries: Array<{
			name: string
			version: unknown
		}>
		magicwords: Array<{
			aliases: string[]
			'case-sensitive': boolean
			name: string
		}>
		namespaces: Array<{
			canonical?: string
			content: boolean
			id: number
			name: string
			noincludable: boolean
			subpages: boolean
		}>
		namespacealiases: Array<{
			alias: string
			id: number
		}>
		protocols: string[]
		rightsinfo: {
			text: string
			url: string
		}
		restrictions: {
			cascadinglevels: string[]
			levels: string[]
			semiprotectedlevels: string[]
			types: string[]
		}
		showhooks: Array<{
			name: string
			subscribers: string[]
		}>
		skins: Array<{
			code: string
			default?: boolean
			name: string
			unusable?: boolean
		}>
		specialpagealiases: Array<{
			aliases: string[]
			realname: string
		}>
		statistics: {
			activeusers: number
			admins: number
			articles: number
			edits: number
			images: number
			jobs: number
			pages: number
			users: number
		}
		uploaddialog: {
			comment: {
				foreign: string
				local: string
			}
			fields: {
				categories: boolean
				date: boolean
				description: boolean
			}
			format: {
				description: string
				filepage: string
				license: string
				onwork: string
				uncategorized: string
			}
			licensemessages: {
				foreign: string
				local: string
			}
		}
		usergroups: Array<{
			name: string
			rights: string[]
		}>
		variables: Array<{
			id: string
			'*': unknown
		}>
	}
}

export interface TokensResponse<T extends TokenType = TokenType> extends QueryResponse {
	query: {
		tokens: {
			[ key in `${ T }token` ]: string
		}
	}
}

export interface UserInfoResponse extends QueryResponse {
	query: {
		userinfo: {
			groups: string[]
			id: number
			name: string
			rights: string[]
		}
	}
}

export interface BlockResponse extends Response {
	block: {
		allowusertalk?: boolean
		anononly?: boolean
		autoblock?: boolean
		expiry: string
		hidename?: boolean
		id: number
		nocreate?: boolean
		noemail?: boolean
		reason: string
		user: string
		userID: number
		watchuser?: boolean
	}
}

export interface DeleteResponse extends Response {
	delete: {
		logid: number
		reason: string
		title: string
	}
}

export interface EditResponse extends Response {
	edit: {
		newrevid: number
		newtimestamp: string
		oldrevid: number
		pageid: number
		result: string
		title: string
	}
}

export interface LoginResponse extends Response {
	login: {
		lguserid: number
		lgusername: string
		result: 'Success'
	} | {
		reason: string
		result: 'Failed'
	}
}

export interface MoveResponse extends Response {
	move: {
		from: string
		reason?: string
		talkfrom?: string
		talkto?: string
		to: string
	}
}

export interface ProtectResponse extends Response {
	protect: {
		protections: string[]
		reason: string
		title: string
	}
}

export interface PurgeResponse extends Response {
	purge: Array<{
		ns: number
		title: string
	} & (
		{
			missing: string
		} | {
			purged: string
		}
	)>
}

export interface RevisionsResponse extends Response {
	query: {
		pages: Array<{
			ns: number
			title: string
		} & ( {
			missing: true
			} | {
			missing?: undefined
			pageid: number
			revisions: [ {
				slots: {
					main: {
						contentmodel: string
						contentformat: string
						content: string
					}
				}
			} ]
		} )>
	}
}

export interface UploadResponse extends Response {
	upload: {
		result: 'Success' | string
		filename?: string
	}
}

export type AllCategoriesResponse = ListQueryResponse<
	'ac',
	'allcategories',
	{
		category: string
	}
>

export type AllImagesResponse = ListQueryResponse<
	'ai',
	'allimages',
	{
		name: string
		timestamp: string
		url: string
		descriptionurl: string
		descriptionshorturl: string
		ns: number
		title: string
	}
>

export type AllPagesResponse = ListQueryResponse<
	'ap',
	'allpages',
	{
		pageid: number
		ns: number
		title: string
	}
>

export type CategoryMembersResponse = ListQueryResponse<
	'cm',
	'categorymembers',
	{
		pageid: number
		ns: number
		title: string
	}
>

export type LinksHereResponse = ListQueryResponse<
	'lh',
	'pages',
	{
		ns: number
		pageid: number
		title: string
		linkshere: Array<{
			ns: number
			pageid: number
			redirect: boolean
			title: string
		}>
	}
>

export type LogEventsResponse = ListQueryResponse<
	'le',
	'logevents',
	{
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
>

export type RecentChangesResponse = ListQueryResponse<
	'rc',
	'recentchanges',
	{
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
>

export type TranscludedInResponse = ListQueryResponse<
	'ti',
	'pages',
	{
		ns: number
		pageid: number
		title: string
		transcludedin: Array<{
			ns: number
			pageid: number
			redirect: boolean
			title: string
		}>
	}
>

export type UserContribsResponse = ListQueryResponse<
	'uc',
	'usercontribs',
	{
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
>

export type UsersResponse = ListQueryResponse<
	'us',
	'users',
	{
		userid: number
		name: string
		groups: string[]
		rights: string[]
	}
>
