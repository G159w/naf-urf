import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import houdini from 'houdini/vite'

const config: UserConfig = {
	server: {
		port: 3000,
	},
	optimizeDeps: {
		exclude: ['svelte-heros-v2']
	},
	plugins: [houdini(), sveltekit()],
};

export default config;
