import { TestContext } from 'yup';

import { intl } from '~utils/intl';

import { customQueries, CustomTestConfig } from '../tests';

export const { formatMessage } = intl({
  'error.unknown': 'There was an error with the request. Please try again.',
});

export function cleanQueryName(queryName: string) {
  const customQueryKey = Object.keys(customQueries).find(
    (k) => k === queryName,
  );

  /* If custom query, return actual query name */
  if (customQueryKey) {
    return customQueries[customQueryKey];
  }

  /* Else, convert first letter to lowercase */
  return queryName.substring(0, 1).toLowerCase() + queryName.substring(1);
}

export function createUnknownError(createError: TestContext['createError']) {
  return createError({
    message: formatMessage({ id: 'error.unknown' }),
  });
}

export function cancelEarly(
  circuitBreaker: NonNullable<CustomTestConfig['circuitBreaker']>,
  value,
) {
  return typeof circuitBreaker === 'boolean'
    ? circuitBreaker
    : !circuitBreaker(value);
}
