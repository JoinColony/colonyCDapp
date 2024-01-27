import { InferType, boolean, object, string } from 'yup';

import {
  USERNAME_REGEX,
  isUsernameTaken,
} from '~common/Onboarding/wizardSteps/StepCreateUser/validation.ts';
import { formatText } from '~utils/intl.ts';

import {
  MAX_BIO_CHARS,
  MAX_DISPLAYNAME_CHARS,
  MAX_LOCATION_CHARS,
} from './consts.ts';
import { UserProfileFormProps } from './types.ts';

export const validationSchema = object<UserProfileFormProps>({
  hasDisplayNameChanged: boolean().default(false),
  displayName: string().when('hasDisplayNameChanged', {
    is: true,
    then: string()
      .max(MAX_DISPLAYNAME_CHARS, formatText({ id: 'too.many.characters' }))
      .matches(
        USERNAME_REGEX,
        formatText({ id: 'error.displayName.valid.message' }),
      )
      .required(formatText({ id: 'errors.displayName.message' }))
      .test(
        'isUsernameTaken',
        formatText({ id: 'error.usernameTaken' }) as string,
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
