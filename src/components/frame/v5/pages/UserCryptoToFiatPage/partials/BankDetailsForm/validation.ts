import { type InferType, object, string } from 'yup';

import { SupportedCurrencies } from '~gql';
import { intl } from '~utils/intl.ts';

import { CURRENCY_VALUES } from '../../constants.ts';

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
    is: CURRENCY_VALUES[SupportedCurrencies.Eur],
    then: string().required(),
    otherwise: string().notRequired(),
  }),
  iban: string().when('currency', {
    is: CURRENCY_VALUES[SupportedCurrencies.Eur],
    then: string()
      .matches(IBAN_REGEX, formatMessage({ id: 'error.iban' }))
      .required(),
    otherwise: string().notRequired(),
  }),
  swift: string().when('currency', {
    is: CURRENCY_VALUES[SupportedCurrencies.Eur],
    then: string()
      .matches(BIC_REGEX, formatMessage({ id: 'error.bic' }))
      .required(),
    otherwise: string().notRequired(),
  }),
  accountNumber: string().when('currency', {
    is: CURRENCY_VALUES[SupportedCurrencies.Usd],
    then: string()
      .required()
      .matches(/^[0-9]+$/)
      .min(8)
      .max(17),
    otherwise: string().notRequired(),
  }),
  routingNumber: string().when('currency', {
    is: CURRENCY_VALUES[SupportedCurrencies.Usd],
    then: string()
      .required()
      .matches(/^[0-9]+$/)
      .min(9)
      .max(9),
    otherwise: string().notRequired(),
  }),
}).defined();

export type FormValues = InferType<typeof validationSchema>;
