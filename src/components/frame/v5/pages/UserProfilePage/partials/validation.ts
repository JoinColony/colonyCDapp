import { type InferType, boolean, object, string } from 'yup';

import {
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  USERNAME_MSG,
  USERNAME_REGEX,
  isUsernameTaken,
} from '~common/Onboarding/wizardSteps/StepCreateUser/validation.ts';
import { formatText } from '~utils/intl.ts';

import { MAX_BIO_CHARS, MAX_LOCATION_CHARS } from './consts.ts';
import { type UserProfileFormProps } from './types.ts';

export const validationSchema = object<UserProfileFormProps>({
  hasDisplayNameChanged: boolean().default(false),
  displayName: string().when('hasDisplayNameChanged', {
    is: true,
    then: string()
      .min(MIN_USERNAME_LENGTH, formatText(USERNAME_MSG.username))
      .max(MAX_USERNAME_LENGTH, formatText(USERNAME_MSG.username))
      .matches(USERNAME_REGEX, formatText(USERNAME_MSG.username))
      .required(formatText(USERNAME_MSG.username))
      .test(
        'isUsernameTaken',
        formatText(USERNAME_MSG.usernameTaken) as string,
        isUsernameTaken,
      ),
  }),
  bio: string().max(MAX_BIO_CHARS, formatText({ id: 'too.many.characters' })),
  website: string().url(formatText({ id: 'userProfilePage.website.error' })),
  location: string().max(
    MAX_LOCATION_CHARS,
    formatText({ id: 'too.many.characters' }),
  ),
}).defined();

export type FormValues = InferType<typeof validationSchema>;
