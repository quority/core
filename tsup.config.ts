import { defineConfig } from 'tsup'

export default defineConfig( {
	clean: true,
	dts: true,
	entry: [ 'src/main.ts', 'src/tests/**/*.ts' ],
	format: [ 'cjs', 'esm' ],
	minify: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	splitting: false,
	treeshake: true 
} )