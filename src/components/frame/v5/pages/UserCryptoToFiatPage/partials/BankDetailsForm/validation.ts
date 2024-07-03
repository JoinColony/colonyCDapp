import { type InferType, object, string } from 'yup';

import { intl } from '~utils/intl.ts';

import { BIC_REGEX, IBAN_REGEX } from './constants.ts';

const { formatMessage } = intl({
  'error.iban': 'Invalid IBAN format',
  'error.bic': 'Invalid SWIFT/BIC format',
});

export const validationSchema = object({
  accountOwner: string().required(),
  bankName: string().required(),
  currency: string().required(),
  country: string().when('currency', {
    is: 'eur',
    then: string().required(),
    otherwise: string().notRequired(),
  }),
  iban: string().when('currency', {
    is: 'eur',
    then: string()
      .matches(IBAN_REGEX, formatMessage({ id: 'error.iban' }))
      .required(),
    otherwise: string().notRequired(),
  }),
  swift: string().when('currency', {
    is: 'eur',
    then: string()
      .matches(BIC_REGEX, formatMessage({ id: 'error.bic' }))
      .required(),
    otherwise: string().notRequired(),
  }),
  accountNumber: string().when('currency', {
    is: 'usd',
    then: string().required(),
    otherwise: string().notRequired(),
  }),
  routingNumber: string().when('currency', {
    is: 'usd',
    then: string().required(),
    otherwise: string().notRequired(),
  }),
}).defined();

export type FormValues = InferType<typeof validationSchema>;
