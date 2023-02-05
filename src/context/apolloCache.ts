import { InMemoryCache } from '@apollo/client';

import { colonyCache } from '~cache';

/*
 * @NOTE Make any modifications to GraphQL query data in here (replaces old client-only resolvers)
 *
 * See: https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies
 */
const cacheUpdates = {
  ...colonyCache,
};

const cache = new InMemoryCache({
  typePolicies: {
    ModelColonyConnection: {
      merge: false,
    },
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
    ...cacheUpdates,
  },
});

export default cache;
