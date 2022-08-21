import type { MaybeArray } from '../../utils'
import type { QueryRequest } from '../../Request'
import type { QueryResponse } from '../../Response'

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

export interface LogEventsItem {
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

export type LogEventsResponse = QueryResponse<
	'le',
	'logevents',
	LogEventsItem
>
