import type * as Action from './actions'

export interface AllActions {
	block: [ Action.BlockRequest, Action.BlockResponse ]
	delete: [ Action.DeleteRequest, Action.DeleteResponse ]
	edit: [ Action.EditRequest, Action.EditResponse ]
	login: [ Action.LoginRequest, Action.LoginResponse ]
	move: [ Action.MoveRequest, Action.MoveResponse ]
	opensearch: [ Action.OpenSearchRequest, Action.OpenSearchResponse ]
	parse: [ Action.ParseRequest, Action.ParseResponse ]
	protect: [ Action.ProtectRequest, Action.ProtectResponse ]
	purge: [ Action.PurgeRequest, Action.PurgeResponse ]
	rollback: [ Action.RollbackRequest, Action.RollbackResponse ]
	undelete: [ Action.UndeleteRequest, Action.UndeleteResponse ]
	upload: [ Action.UploadRequest, Action.UploadResponse ]
}
