/** @type {import('houdini').ConfigFile} */
const config = {
    "client": "./src/client",
    defaultPartial: true,
    include: ["src/routes/**/*.{svelte,graphql,gql,ts}", "src/graphql/**/*{svelte,graphql,gql,ts}"],
    exclude: "src/lib/server/graphql/resolvers.ts",
}

export default config
