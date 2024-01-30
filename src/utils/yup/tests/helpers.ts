import { type TestContext } from 'yup';

import { intl } from '~utils/intl.ts';

import { type CustomTestConfig } from './index.ts';

export const { formatMessage } = intl({
  'error.unknown': 'There was an error with the request. Please try again.',
});

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
