import { InMemoryCache } from '@apollo/client';

import { colonyCache } from '~cache';

/*
 * @NOTE Make any modifications to GraphQL query data in here (replaces old client-only resolvers)
 *
 * See: https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies
 */
const localOnlyFields = {
  ...colonyCache,
};

const cache = new InMemoryCache({
  typePolicies: {
    ModelColonyConnection: {
      merge: false,
    },
    ...localOnlyFields,
  },
});

export default cache;
