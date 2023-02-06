import { string, object, array, ObjectSchema } from 'yup';

import {
  EmailPermissions,
  GetProfileByEmailDocument,
  GetUserByNameDocument,
} from '~gql';
import { intl } from '~utils/intl';
import { createYupTestFromQuery } from '~utils/yup/tests';

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
  query: GetProfileByEmailDocument,
  isOptional: true,
  circuitBreaker: isValidEmail,
});
const isUsernameTaken = createYupTestFromQuery({
  query: GetUserByNameDocument,
  circuitBreaker: isValidUsername,
});

export type UserEmailPermission = `${EmailPermissions}`;
type UserEmailPermissions = Array<UserEmailPermission>;

export interface FormValues {
  [k: string]: string | UserEmailPermissions;
  username: string;
  email: string;
  emailPermissions: UserEmailPermissions;
}

export type UserWizardStep1 = Pick<FormValues, 'email' | 'emailPermissions'>;
export type UserWizardStep2 = Pick<FormValues, 'username'>;
export const userStep1: UserWizardStep1 = {
  email: '',
  emailPermissions: [],
};
export const userStep2 = { username: '' };
export const initialValues: [UserWizardStep1, UserWizardStep2] = [
  userStep1,
  userStep2,
];

export const stepUserEmailValidationSchema: ObjectSchema<UserWizardStep1> =
  object({
    email: string()
      .default(userStep1.email)
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
    emailPermissions: array()
      .defined()
      .of(
        string()
          .defined()
          .oneOf<UserEmailPermission>([
            EmailPermissions.IsHuman,
            EmailPermissions.SendNotifications,
          ]),
      )
      .default(userStep1.emailPermissions),
  }).defined();

export const stepUserNameValidationSchema: ObjectSchema<UserWizardStep2> =
  object({
    username: string()
      .default(userStep2.username)
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
  }).defined();

function isValidUsername(username: string) {
  return username ? new RegExp(USERNAME_REGEX).test(username) : false;
}

function isValidEmail(email: string) {
  return email ? new RegExp(EMAIL_REGEX).test(email) : false;
}
