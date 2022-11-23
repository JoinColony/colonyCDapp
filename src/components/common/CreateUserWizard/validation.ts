import { string, object, array } from 'yup';

import { getProfileByEmail, getUserByName } from '~gql';
import { intl } from '~utils/intl';
import { createYupTestFromQuery } from '~utils/yup';

/*
 * The username regex is composed of
 * ^[A-Za-z0-9] starts with upper case, lower case or numerals
 * [\w-.] can include upper case, lower case, numerals, underscore, hyphen or period
 * {0,254}$ match the preceding set at least 0 and at most 254 times from the end (so excluding the first char)
 */
const USERNAME_REGEX = /^[A-Za-z0-9][\w-.]{0,254}$/;

const { formatMessage } = intl({
  'error.usernameRequired': 'Enter a username to continue',
  'error.usernameTaken': 'This username is already taken',
  'error.validEmail': 'Enter a valid email address',
  'error.emailRequired':
    'Enter your email to continue, or uncheck options below',
  'error.emailAlreadyRegistered':
    'This email is already associated with a colony username',
  'error.username': 'This is not a valid colony username',
});

const isEmailAlreadyRegistered = createYupTestFromQuery({
  query: getProfileByEmail,
  isOptional: true,
});
const isUsernameTaken = createYupTestFromQuery({
  query: getUserByName,
  circuitBreaker: isValidUsername,
});

export const stepUserEmailValidationSchema = object({
  email: string()
    .email(formatMessage({ id: 'error.validEmail' }))
    .test(
      'isEmailAlreadyRegistered',
      formatMessage({ id: 'error.emailAlreadyRegistered' }),
      isEmailAlreadyRegistered,
    )
    .when('emailPermissions', {
      is: (val) => val.length > 0,
      then: string().required(formatMessage({ id: 'error.emailRequired' })),
    }),
  emailPermissions: array().of(string()),
});

export const stepUserNameValidationSchema = object({
  username: string()
    .required(formatMessage({ id: 'error.usernameRequired' }))
    .max(255)
    .test(
      'isValidUsername',
      formatMessage({ id: 'error.username' }),
      isValidUsername,
    )
    .test(
      'isUsernameTaken',
      formatMessage({ id: 'error.usernameTaken' }),
      isUsernameTaken,
    ),
});

function isValidUsername(username: string) {
  return username ? new RegExp(USERNAME_REGEX).test(username) : false;
}
