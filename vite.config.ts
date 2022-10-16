import { sveltekit } from '@sveltejs/kit/vite';
import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'
import type { UserConfig } from 'vite';
import houdini from 'houdini/vite'

const config: UserConfig = {
	server: {
		port: 3000,
	},
	plugins: [viteCommonjs(), houdini(), sveltekit()],
	optimizeDeps: {
		esbuildOptions: {
			plugins: [esbuildCommonjs(['./$type-graphql'])]
		},
		include: ['./$type-graphql'],
	}
};

export default config;
