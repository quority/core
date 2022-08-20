import { defineConfig } from 'tsup'

export default defineConfig( {
	clean: true,
	entry: [ 'src/main.ts' ],
	format: [ 'cjs', 'esm' ],
	minify: true,
	sourcemap: true,
	splitting: true,
	treeshake: true
} )