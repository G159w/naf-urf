import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: vercel({
			edge: false,	  
			// an array of dependencies that esbuild should treat
			// as external when bundling functions
			external: [],
			split: false
		  }),
		alias: {
			$houdini: path.resolve('.', '$houdini'),
			"$type-graphql": path.resolve('.', '$type-graphql')
		}
	},
};

export default config;
