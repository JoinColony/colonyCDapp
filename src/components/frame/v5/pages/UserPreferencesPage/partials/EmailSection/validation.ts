import { object, string } from 'yup';

import { isEmailAlreadyRegistered } from '~common/Onboarding/wizardSteps/StepCreateUser/validation.ts';
import { formatText } from '~utils/intl.ts';

export interface UserEmailFormValues {
  email?: string | null;
}
export const validationSchema = object<UserEmailFormValues>({
  email: string()
    .email(formatText({ id: 'error.validEmail' }))
    .test(
      'isEmailAlreadyRegistered',
      formatText({ id: 'error.emailAlreadyRegistered' }),
      isEmailAlreadyRegistered,
    ),
});
