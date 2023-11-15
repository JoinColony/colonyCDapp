import { InMemoryCache } from '@apollo/client';

import colonyCache from './colony';
import expenditureCache from './expenditure';

/*
 * @NOTE Make any modifications to GraphQL query data in here (replaces old client-only resolvers)
 *
 * See: https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies
 */
const cacheUpdates = {
  ...colonyCache,
  ...expenditureCache,
};

const cache = new InMemoryCache({
  typePolicies: {
    ModelColonyConnection: {
      merge: false,
    },
    Domain: {
      fields: {
        metadata: {
          merge(existing, incoming) {
            // If there's no existing metadata, use the incoming data
            if (!existing) return incoming;

            // Otherwise, merge the existing and incoming data
            return {
              ...existing,
              ...incoming,
            };
          },
        },
      },
    },
    Query: {
      fields: {
        searchColonyActions: {
          keyArgs: ['$filter', '$sort'],
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
        getColony: {
          keyArgs: ['id'],
          merge(existing = {}, incoming = {}) {
            // Merge watchers
            const watchers = existing.watchers
              ? {
                  ...existing.watchers,
                  ...(incoming.watchers ?? {}),
                  items: [
                    ...(existing?.watchers?.items ?? []),
                    ...(incoming?.watchers?.items ?? []),
                  ],
                }
              : incoming.watchers;

            // Merge extensions
            const extensions = existing.extensions
              ? {
                  ...existing.extensions,
                  ...(incoming.extensions ?? {}),
                  items: [
                    ...(existing?.extensions?.items ?? []),
                    ...(incoming?.extensions?.items ?? []),
                  ],
                }
              : incoming.extensions;

            // Return the merged object
            return {
              ...existing,
              ...incoming,
              watchers,
              extensions,
            };
          },
        },
      },
    },
    ...cacheUpdates,
  },
});

export default cache;
