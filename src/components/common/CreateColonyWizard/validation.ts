import { string, object } from 'yup';

import { GetFullColonyByNameDocument } from '~gql';
import { intl } from '~utils/intl';
import { createYupTestFromQuery } from '~utils/yup';

/*
 * The colony name regex is composed of
 * ^[A-Za-z0-9] starts with upper case, lower case or numerals
 * [A-Za-z0-9_] can include upper case, lower case, numerals or underscore
 * {0,254}$ match the preceding set at least 0 and at most 254 times from the end (so excluding the first char)
 */
const COLONY_NAME_REGEX = `^[A-Za-z0-9][A-Za-z0-9_]{0,254}$`;

const isNameTaken = createYupTestFromQuery({
  query: GetFullColonyByNameDocument,
  circuitBreaker: isValidName,
});

const { formatMessage } = intl({
  'error.urlTaken': 'This colony URL is already taken',
  'error.colonyURL': 'This is not a valid colony URL',
  'error.colonyNameRequired': 'Enter a name to continue',
  'error.colonyURLRequired': 'Enter a URL to continue',
});

export const validationSchema = object({
  displayName: string().required(
    formatMessage({ id: 'error.colonyNameRequired' }),
  ),
  colonyName: string()
    .required(formatMessage({ id: 'error.colonyURLRequired' }))
    .test('isValidName', formatMessage({ id: 'error.colonyURL' }), isValidName)
    .test('isNameTaken', formatMessage({ id: 'error.urlTaken' }), isNameTaken),
});

function isValidName(name: string) {
  return name ? new RegExp(COLONY_NAME_REGEX).test(name) : true;
}
