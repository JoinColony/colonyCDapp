/**
 * ApolloLink automatically removing __typename key from variables
 * Loosely based on https://github.com/apollographql/apollo-client/pull/10853
 * It should be replaced with Apollo's provided solution once we can upgrade
 * to a version above 3.8
 */

import { ApolloLink } from '@apollo/client';

import { isPlainObject } from '~utils/lodash';

const omitDeep = <T extends Record<string, unknown>, K>(
  value: T,
  key: K,
  known = new Map<any, any>(),
) => {
  if (known.has(value)) {
    return known.get(value);
  }

  if (Array.isArray(value)) {
    const array: any[] = [];
    known.set(value, array);
    value.forEach((item) => {
      const result = omitDeep(item, key, known);
      array.push(result);
    });
    return array;
  }

  if (isPlainObject(value)) {
    const object = {};
    known.set(value, object);
    Object.keys(value).forEach((objectKey) => {
      if (objectKey === key) {
        return;
      }
      const result = omitDeep(
        value[objectKey] as Record<string, unknown>,
        key,
        known,
      );
      object[objectKey] = result;
    });
    return object;
  }

  return value;
};

export default new ApolloLink((operation, forward) => {
  if (!operation.variables) {
    return forward(operation);
  }

  /**
   * Using Object.create to keep the original object's prototype
   * which is needed by following links in the chain
   */
  const modifiedOperation = Object.create(operation);
  modifiedOperation.variables = omitDeep(operation.variables, '__typename');

  return forward(modifiedOperation);
});
