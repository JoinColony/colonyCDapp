import { defineMessages } from 'react-intl';
import { object, string } from 'yup';

import { GetProfileByEmailDocument, GetUserByNameDocument } from '~gql';
import { formatText } from '~utils/intl.ts';
import { createYupTestFromQuery } from '~utils/yup/tests/index.ts';

export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;

/*
 * The username regex is composed of
 * ^[A-Za-z0-9] starts with upper case, lower case or numerals
 * [\w-.] can include upper case, lower case, numerals, underscore, hyphen or period
 * {0,254}$ match the preceding set at least 0 and at most 254 times from the end (so excluding the first char)
 */
export const USERNAME_REGEX = /^[A-Za-z0-9][\w-.]+$/;

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

export const USERNAME_MSG = defineMessages({
  username: {
    id: 'error.username',
    defaultMessage:
      'Usernames can contain letters, numbers or dashes and be between 3 and 30 characters.',
  },
  usernameTaken: {
    id: 'error.usernameTaken',
    defaultMessage: 'Username unavailable',
  },
});

const MSG = defineMessages({
  validEmail: {
    id: 'error.validEmail',
    defaultMessage: 'A valid email is required',
  },
  emailAlreadyRegistered: {
    id: 'error.emailAlreadyRegistered',
    defaultMessage: 'This email is already associated with a colony username',
  },
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
    .required(formatText(USERNAME_MSG.username))
    .min(MIN_USERNAME_LENGTH, formatText(USERNAME_MSG.username))
    .max(MAX_USERNAME_LENGTH, formatText(USERNAME_MSG.username))
    .test(
      'isValidUsername',
      formatText(USERNAME_MSG.username) as string,
      isValidUsername,
    )
    .test(
      'isUsernameTaken',
      formatText(USERNAME_MSG.usernameTaken) as string,
      isUsernameTaken,
    ),
  emailAddress: string()
    .email(formatText(MSG.validEmail))
    .required(formatText(MSG.validEmail))
    .test(
      'isEmailAlreadyRegistered',
      formatText(MSG.emailAlreadyRegistered) as string,
      isEmailAlreadyRegistered,
    ),
}).defined();
