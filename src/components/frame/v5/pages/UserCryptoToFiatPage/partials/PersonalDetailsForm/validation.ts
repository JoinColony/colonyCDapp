import { type InferType, object, string } from 'yup';

import { formErrorMessage, formatText } from '~utils/intl.ts';

import { PERSONAL_DETAILS_FORM_MSGS } from './constants.ts';

export const validationSchema = object({
  firstName: string().required(
    formatText({ id: 'cryptoToFiat.forms.error.personalDetails.firstName' }),
  ),
  lastName: string().required(
    formatText({ id: 'cryptoToFiat.forms.error.personalDetails.lastName' }),
  ),
  email: string()
    .email(formErrorMessage(PERSONAL_DETAILS_FORM_MSGS.emailLabel, 'invalid'))
    .required(
      formatText({ id: 'cryptoToFiat.forms.error.personalDetails.email' }),
    ),
}).defined();

export type FormValues = InferType<typeof validationSchema>;
