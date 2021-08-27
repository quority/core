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

	export interface LogEvents extends ApiQuery {
		leprop?: Array<'ids' | 'title' | 'type' | 'user' | 'userid' | 'timestamp' | 'comment' | 'details' | 'tags'>
		letype?: 'abusefilter' | 'abusefilterprivatedetails' | 'block' | 'contentmodel' | 'create' | 'delete' | 'gblblock' | 'gblrename' | 'gblrights' | 'globalauth' | 'import' | 'liquidthreads' | 'managetags' | 'massmessage' | 'merge' | 'move' | 'newsletter' | 'newusers' | 'notifytranslators' | 'oath' | 'pagelang' | 'pagetranslation' | 'patrol' | 'protect' | 'renameuser' | 'rights' | 'spamblacklist' | 'suppress' | 'tag' | 'thanks' | 'timedmediahandler' | 'titleblacklist' | 'translationreview' | 'upload' | 'urlshortener' | 'usermerge'
		leaction?: 'abusefilter/create' | 'abusefilter/hit' | 'abusefilter/modify' | 'abusefilterprivatedetails/access' | 'block/block' | 'block/reblock' | 'block/unblock' | 'contentmodel/change' | 'contentmodel/new' | 'create/create' | 'delete/delete' | 'delete/delete_redir' | 'delete/delete_redir2' | 'delete/event' | 'delete/flow-delete-post' | 'delete/flow-delete-topic' | 'delete/flow-restore-post' | 'delete/flow-restore-topic' | 'delete/restore' | 'delete/revision' | 'gblblock/dwhitelist' | 'gblblock/gblock' | 'gblblock/gblock2' | 'gblblock/gunblock' | 'gblblock/modify' | 'gblblock/whitelist' | 'gblrename/merge' | 'gblrename/promote' | 'gblrename/rename' | 'gblrights/deleteset' | 'gblrights/groupperms' | 'gblrights/groupprms2' | 'gblrights/groupprms3' | 'gblrights/grouprename' | 'gblrights/newset' | 'gblrights/setchange' | 'gblrights/setnewtype' | 'gblrights/setrename' | 'gblrights/usergroups' | 'globalauth/delete' | 'globalauth/hide' | 'globalauth/lock' | 'globalauth/lockandhid' | 'globalauth/setstatus' | 'globalauth/unhide' | 'globalauth/unlock' | 'import/interwiki' | 'import/lqt-to-flow-topic' | 'import/upload' | 'interwiki/*' | 'liquidthreads/merge' | 'liquidthreads/move' | 'liquidthreads/resort' | 'liquidthreads/signatureedit' | 'liquidthreads/split' | 'liquidthreads/subjectedit' | 'lock/flow-lock-topic' | 'lock/flow-restore-topic' | 'managetags/activate' | 'managetags/create' | 'managetags/deactivate' | 'managetags/delete' | 'massmessage/*' | 'massmessage/failure' | 'massmessage/send' | 'massmessage/skipbadns' | 'massmessage/skipnouser' | 'massmessage/skipoptout' | 'merge/merge' | 'move/move' | 'move/move_redir' | 'newsletter/*' | 'newusers/autocreate' | 'newusers/byemail' | 'newusers/create' | 'newusers/create2' | 'newusers/forcecreatelocal' | 'newusers/newusers' | 'notifytranslators/sent' | 'oath/*' | 'pagelang/pagelang' | 'pagetranslation/associate' | 'pagetranslation/deletefnok' | 'pagetranslation/deletefok' | 'pagetranslation/deletelnok' | 'pagetranslation/deletelok' | 'pagetranslation/discourage' | 'pagetranslation/dissociate' | 'pagetranslation/encourage' | 'pagetranslation/mark' | 'pagetranslation/movenok' | 'pagetranslation/moveok' | 'pagetranslation/prioritylanguages' | 'pagetranslation/unmark' | 'patrol/autopatrol' | 'patrol/patrol' | 'protect/modify' | 'protect/move_prot' | 'protect/protect' | 'protect/unprotect' | 'renameuser/renameuser' | 'rights/autopromote' | 'rights/blockautopromote' | 'rights/restoreautopromote' | 'rights/rights' | 'spamblacklist/*' | 'suppress/block' | 'suppress/cadelete' | 'suppress/delete' | 'suppress/event' | 'suppress/flow-restore-post' | 'suppress/flow-restore-topic' | 'suppress/flow-suppress-post' | 'suppress/flow-suppress-topic' | 'suppress/hide-afl' | 'suppress/reblock' | 'suppress/revision' | 'suppress/setstatus' | 'suppress/unhide-afl' | 'tag/update' | 'thanks/*' | 'timedmediahandler/resettranscode' | 'titleblacklist/*' | 'translationreview/group' | 'translationreview/message' | 'upload/overwrite' | 'upload/revert' | 'upload/upload' | 'urlshortener/*' | 'usermerge/*'
		lestart?: string
		leend?: string
		ledir?: 'newer' | 'older'
		leuser?: string
		letitle?: string
		lenamespace?: number
		lelimit?: number | 'max'
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
