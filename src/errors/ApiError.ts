import * as AE from './api'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiErrorConstructor = new ( ...args: any ) => AE.ApiError

const errors: Record<string, ApiErrorConstructor> = {
	assertbotfailed: AE.AssertBotFailedError,
	assertuserfailed: AE.AssertUserFailedError,
	autoblocked: AE.AutoBlockedError,
	badtoken: AE.BadTokenError,
	blocked: AE.BlockedError,
	cascadeprotected: AE.CascadeProtectedError,
	confirmemail: AE.ConfirmEmailError,
	customcssjsprotected: AE.CustomCSSJSProtectedError,
	hookaborted: AE.HookAbortedError,
	invalidtitle: AE.InvalidTitleError,
	missingtitle: AE.MissingTitleError,
	mustbeposted: AE.MustBePostedError,
	noapiwrite: AE.NoAPIWriteError,
	nosuchpageid: AE.NoSuchPageIdError,
	nosuchrcid: AE.NoSuchRCIDError,
	nosuchrevid: AE.NoSuchRevIDError,
	nosuchuser: AE.NoSuchUserError,
	permissiondenied: AE.PermissionDeniedError,
	protectednamespace: AE.ProtectedNamespaceError,
	'protectednamespace-interface': AE.ProtectedNamespaceInterfaceError,
	protectedpage: AE.ProtectedPageError,
	ratelimited: AE.RateLimitedError,
	readapidenied: AE.ReadAPIDeniedError,
	readonly: AE.ReadonlyError
}

export class ApiErrors {
	static getError( code: keyof typeof errors | string ): ApiErrorConstructor {
		return errors[ code ] ?? AE.UnknownError
	}
}
