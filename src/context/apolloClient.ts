import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
/*
 * @TODO This needs to be fetched from a proper location
 */
const httpLink = new HttpLink({
  uri: 'http://localhost:20002/graphql',
  headers: {
    'x-api-key': 'da2-fakeApiId123456',
  },
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getActionsByColony: {
          keyArgs: false,
          merge(existing = {}, incoming) {
            return {
              ...existing,
              items: [...(existing.items ?? []), ...incoming.items],
            };
          },
        },
      },
    },
    ModelColonyConnection: {
      merge: false,
    },
  },
});

export default new ApolloClient({
  link: httpLink,
  connectToDevTools: true,
  cache,
  /*
   * @TODO Most likely we'll need to add resolvers here as well
   */
});
