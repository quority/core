interface IUploadResponse {
	upload: {
		result: 'Success' | string
		filename?: string
	}
}