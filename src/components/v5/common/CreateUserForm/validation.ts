import { array, object, string } from 'yup';

import { GetProfileByEmailDocument, GetUserByNameDocument } from '~gql';
import { intl } from '~utils/intl';
import { createYupTestFromQuery } from '~utils/yup/tests';

export const MAX_USERNAME_LENGTH = 30;

/*
 * The username regex is composed of
 * ^[A-Za-z0-9] starts with upper case, lower case or numerals
 * [\w-.] can include upper case, lower case, numerals, underscore, hyphen or period
 * {0,254}$ match the preceding set at least 0 and at most 254 times from the end (so excluding the first char)
 */
const USERNAME_REGEX = /^[A-Za-z0-9][\w-.]{0,254}$/;

/*
 * Simple email validation regex. Used to stop test from running if email input is invalid.
 * Note that we could use yup's own regex here, but it's quite unreadable, and this is practically-speaking equivalent.
 */
// eslint-disable-next-line no-useless-escape
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]+$/;

function isValidUsername(username: string) {
  return username ? new RegExp(USERNAME_REGEX).test(username) : false;
}

function isValidEmail(email: string) {
  return email ? new RegExp(EMAIL_REGEX).test(email) : false;
}

const { formatMessage } = intl({
  'error.usernameRequired': 'A valid username is required',
  'error.usernameTaken': 'Username unavailable',
  'error.validEmail': 'A valid email is required',
  'error.emailAlreadyRegistered':
    'This email is already associated with a colony username',
  'error.usernameLength': 'Too many characters',
});

export const isEmailAlreadyRegistered = createYupTestFromQuery({
  query: GetProfileByEmailDocument,
  isOptional: true,
  circuitBreaker: isValidEmail,
});

export const isUsernameTaken = createYupTestFromQuery({
  query: GetUserByNameDocument,
  circuitBreaker: isValidUsername,
});

export const validationSchema = object({
  username: string()
    .required(formatMessage({ id: 'error.usernameRequired' }))
    .max(30, formatMessage({ id: 'error.usernameLength' }))
    .test(
      'isValidUsername',
      formatMessage({ id: 'error.usernameRequired' }),
      isValidUsername,
    )
    .test(
      'isUsernameTaken',
      formatMessage({ id: 'error.usernameTaken' }),
      isUsernameTaken,
    ),
  emailAddress: string()
    .email(formatMessage({ id: 'error.validEmail' }))
    .required(formatMessage({ id: 'error.validEmail' }))
    .test(
      'isEmailAlreadyRegistered',
      formatMessage({ id: 'error.emailAlreadyRegistered' }),
      isEmailAlreadyRegistered,
    ),
  emailPermissions: array().defined().of(string().defined()),
}).defined();
