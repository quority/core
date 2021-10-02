import {
	RequireOnlyOne
} from './utils'
import fs from 'fs'

export namespace MediaWikiRequest {
	/**
	 * Options to block an user.
	 */
	export interface Block {
		action: 'block' | 'unblock'

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
		 * A "csrf" token.
		 */
		token: string

		/**
		 * User to block.
		 */
		user: string
	}

	/**
	 * Options to delete a page.
	 */
	export type Delete = RequireOnlyOne<{
		action: 'delete'

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

		/**
		 * A "csrf" token.
		 */
		token: string
	}, 'title' | 'pageid'>

	/**
	 * Options to edit a page.
	 */
	export type Edit = RequireOnlyOne<{
		action: 'edit'

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
		 * A "csrf" token.
		 */
		token: string

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
	}, 'title' | 'pageid'>

	/**
	 * Options to login into an account.
	 */
	export interface Login {
		action: 'login'

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

	/**
	 * Options to move a page.
	 */
	export type Move = RequireOnlyOne<{
		action: 'move'

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

		/**
		 * A "csrf" token.
		 */
		token: string
	}, 'from' | 'fromid'>

	type ProtectionAction = 'edit' | 'move'
	type ProtectionLevel = 'all' | 'autoconfirmed' | 'sysop'
	/**
	 * Options to protect a page.
	 */
	export type Protect<Action extends string = ProtectionAction, Level extends string = ProtectionLevel> = RequireOnlyOne<{
		action: 'protect'

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
		protections: Array<`${ Action }=${ Level }`> | ''

		/**
		 * Reason for (un)protecting.
		 */
		reason?: string

		/**
		 * Title of the page to (un)protect. Cannot be used together with pageid.
		 */
		title: string

		/**
		 * A "csrf" token.
		 */
		token: string
	}, 'title' | 'pageid'>

	/**
	 * Options to purge the cache for the given titles.
	 */
	export type Purge = RequireOnlyOne<{
		action: 'purge'

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
	}, 'pageids' | 'revids' | 'titles'>

	/**
	 * Options to upload a file.
	 */
	export type Upload = RequireOnlyOne<{
		action: 'upload'

		/**
		 * File contents.
		 */
		file: fs.ReadStream

		/**
		 * Target filename.
		 */
		filename: string

		/**
		 * Ignore any warnings.
		 */
		ignorewarnings?: boolean

		/**
		 * A "csrf" token.
		 */
		token: string

		/**
		 * URL to fetch the file from.
		 */
		url: string
	}, 'file' | 'url'>
}
