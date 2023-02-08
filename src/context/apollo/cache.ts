import { InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getActionsByColony: {
          keyArgs: ['$colonyAddress', '$sortDirection'],
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

export default cache;
