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
          keyArgs: ['$colonyAddress'],
          /**
           * The following function takes care of merging already fetched actions
           * with the next set of paginated actions
           */
          merge(existing = {}, incoming, { readField, args }) {
            const { nextToken } = args || {};
            const items = existing && nextToken ? { ...existing.items } : {};
            incoming.items.forEach((item) => {
              const id = readField('id', item);
              if (typeof id === 'string') {
                items[id] = item;
              }
            });
            return {
              ...existing,
              nextToken: incoming.nextToken,
              items,
            };
          },
          read(existing) {
            if (existing) {
              return {
                ...existing,
                items: Object.values(existing.items),
              };
            }
            return undefined;
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
