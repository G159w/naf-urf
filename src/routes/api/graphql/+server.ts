import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import resolvers from '$lib/server/graphql/resolvers';
import { useGraphQlJit } from '@envelop/graphql-jit';
import { createYoga, renderGraphiQL } from 'graphql-yoga';
import type { RequestEvent } from '@sveltejs/kit';
import { createContext } from '$lib/server/context';
import { logger } from '$lib/server/logger';

const schema = buildSchemaSync({ resolvers });
const yogaApp = createYoga<RequestEvent>({
	logging: false,
	schema: schema,
	context: createContext,
	plugins: [
		useGraphQlJit()
		// other plugins: https://www.envelop.dev/plugins
	],
	graphqlEndpoint: '/api/graphql',
	renderGraphiQL,
	graphiql: {
		defaultQuery: `query Hello {
	hello
}`
	},
	fetchAPI: globalThis
});
logger.info('test');
export { yogaApp as GET, yogaApp as POST };
