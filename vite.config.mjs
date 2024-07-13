import * as path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	tsconfigPaths: ['./tsconfig.build.json'],
	build: {
		sourcemap: true,
		ssr: true,
		target: 'node16',
		lib: {
			formats: ['es'],
			entry: path.resolve(__dirname, 'src/index.ts'),
			fileName: 'index',
		},
	},
	plugins: [tsconfigPaths(), dts()],
	test: {
		tsconfigPaths: ['./tsconfig.json'],
		coverage: {
			enabled: true,
			include: ['src'],
			thresholds: {
				branches: 75,
			},
		},
	},
});
