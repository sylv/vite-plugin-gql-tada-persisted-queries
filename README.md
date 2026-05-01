# vite-plugin-gql-tada-persisted-queries

this plugin automatically handles [gql.tada's persisted queries](https://gql-tada.0no.co/guides/persisted-documents) for you, without having to use `graphql.persisted()` manually.

- converts all `graphql()` calls into `graphql.persisted()` calls
- optionally removes the source code, leaving only the persisted query hash
- merges new query hashes into an existing persisted queries file
- writes introspected schema and/or `possibleTypes`

essentially, it converts this:
```ts
import { graphql } from '../graphql'

const fragment = graphql(`
    fragment MyFragment on User {
        id
        name
    }
`)

const query = graphql(`
    query GetUser($id: ID!) {
        user(id: $id) {
            ...MyFragment
        }
    }
`, [fragment])
```
into this:
```ts
import { graphql } from '../graphql'

const query = graphql.persisted('HASH_OF_QUERY', graphql(`
    query GetUser($id: ID!) {
        user(id: $id) {
            ...MyFragment
        }
    }

    fragment MyFragment on User {
        id
        name
    }
`))
```

## usage

```ts
import { persistedQueries } from 'vite-plugin-gql-tada-persisted-queries'

export default defineConfig({
    plugins: [
        persistedQueries({
            outputPath: 'queries.json',
            addTypename: true, // optional, whether to add __typename to queries
            enabled: true, // optional, === false disables the plugin
            removeSource: true, // optional, removes the source of the query. may break some client libraries
        })
    ]
})
```

## notes

- fragment definitions and fragment imports are not actually removed when they are merged into queries. they are converted to a persisted query too, but because they are unused treeshaking will remove them from the final bundle.
- `removeSource` may break some client libraries, it should work the same as [Compiling away GraphQL Documents](https://gql-tada.0no.co/guides/persisted-documents#compiling-away-graphql-documents) in gql.tada's documentation and has the same caveats.
- this uses regex to extract imports/queries, so it might have some edge cases not accounted for.
- variable names for queries must be globally unique
