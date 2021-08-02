namespace MWRequest {
	export interface Upload {
		action: 'upload',
		file: fs.ReadStream,
		filename: string,
		ignorewarnings?: 1,
		token: string
	}
}