/** @type {import('houdini').ConfigFile} */
const config = {
    "client": "./src/client",
    defaultPartial: true,
    apiUrl: 'http://localhost:3000/api/graphql',
    include: ["src/routes/**/*.{svelte,graphql,gql,ts}", "src/graphql/**/*{svelte,graphql,gql,ts}"],
    exclude: "src/lib/server/graphql/resolvers.ts",
}

export default config
