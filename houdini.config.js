/// <references types="houdini-svelte">
/** @type {import('houdini').ConfigFile} */
const config = {
    plugins: {
        'houdini-svelte': {
            client: './src/client.ts',
        }
    },
    defaultPartial: true,
    apiUrl: 'http://localhost:3000/api/graphql',
    include: ["src/routes/**/*.{svelte,graphql,gql,ts}", "src/graphql/**/*{svelte,graphql,gql,ts}", "src/lib/component/**/*{svelte,graphql,gql,ts}"],
    exclude: "src/lib/server/**/*{svelte,graphql,gql,ts}",
    scalars: {
        // the name of the scalar we are configuring
        DateTime: {
          // the corresponding typescript type (what the typedef generator leaves behind in the response and operation inputs)
          type: 'DateTime',
          // turn the api's response into that type
          unmarshal(val) {
            const date = new Date(val).toISOString()
            return date
          },
          // turn the value into something the API can use
          marshal(date) {
            return date.getTime()
          },
        },
    }
        
}

export default config
