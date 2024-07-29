import { type InferType, object, string } from 'yup';

import { SupportedCurrencies } from '~gql';
import { formErrorMessage } from '~utils/intl.ts';
import { capitalizeFirstLetter } from '~utils/strings.ts';

import { CURRENCY_VALUES } from '../../constants.ts';

import {
  BANK_DETAILS_FORM_FIELD_VALUE_LENGTHS,
  BANK_DETAILS_FORM_MSG,
  BIC_REGEX,
  IBAN_REGEX,
} from './constants.ts';

const { accountNumber, routingNumber } = BANK_DETAILS_FORM_FIELD_VALUE_LENGTHS;

export const validationSchema = object({
  accountOwner: string().required(
    formErrorMessage(BANK_DETAILS_FORM_MSG.accountOwnerNameLabel, 'required'),
  ),
  bankName: string().required(
    formErrorMessage(BANK_DETAILS_FORM_MSG.bankNameLabel, 'required'),
  ),
  currency: string().required(
    formErrorMessage(BANK_DETAILS_FORM_MSG.payoutCurrencyLabel, 'required'),
  ),
  country: string().when('currency', {
    is: CURRENCY_VALUES[SupportedCurrencies.Eur],
    then: string().required(
      formErrorMessage(BANK_DETAILS_FORM_MSG.countryLabel, 'required'),
    ),
    otherwise: string().notRequired(),
  }),
  iban: string().when('currency', {
    is: CURRENCY_VALUES[SupportedCurrencies.Eur],
    then: string()
      .required(formErrorMessage(BANK_DETAILS_FORM_MSG.ibanLabel, 'required'))
      .matches(
        IBAN_REGEX,
        formErrorMessage(BANK_DETAILS_FORM_MSG.ibanLabel, 'invalid'),
      ),
    otherwise: string().notRequired(),
  }),
  swift: string().when('currency', {
    is: CURRENCY_VALUES[SupportedCurrencies.Eur],
    then: string()
      .required(formErrorMessage(BANK_DETAILS_FORM_MSG.swiftLabel, 'required'))
      .matches(
        BIC_REGEX,
        formErrorMessage(BANK_DETAILS_FORM_MSG.swiftLabel, 'invalid'),
      ),
    otherwise: string().notRequired(),
  }),
  accountNumber: string().when('currency', {
    is: CURRENCY_VALUES[SupportedCurrencies.Usd],
    then: string()
      .required(
        formErrorMessage(BANK_DETAILS_FORM_MSG.accountNumberLabel, 'required'),
      )
      .matches(
        /^[0-9]+$/,
        capitalizeFirstLetter(
          formErrorMessage(BANK_DETAILS_FORM_MSG.accountNumberLabel, 'invalid'),
          { lowerCaseRemainingLetters: true },
        ),
      )
      .min(
        accountNumber.min,
        formErrorMessage(
          BANK_DETAILS_FORM_MSG.accountNumberLabel,
          'min',
          accountNumber.min,
        ),
      )
      .max(
        accountNumber.max,
        formErrorMessage(
          BANK_DETAILS_FORM_MSG.accountNumberLabel,
          'min',
          accountNumber.max,
        ),
      ),
    otherwise: string().notRequired(),
  }),
  routingNumber: string().when('currency', {
    is: CURRENCY_VALUES[SupportedCurrencies.Usd],
    then: string()
      .required(
        formErrorMessage(BANK_DETAILS_FORM_MSG.routingNumberLabel, 'required'),
      )
      .matches(
        /^[0-9]+$/,
        capitalizeFirstLetter(
          formErrorMessage(BANK_DETAILS_FORM_MSG.routingNumberLabel, 'invalid'),
          { lowerCaseRemainingLetters: true },
        ),
      )
      .length(
        routingNumber.length,
        formErrorMessage(
          BANK_DETAILS_FORM_MSG.routingNumberLabel,
          'length',
          routingNumber.length,
        ),
      ),
    otherwise: string().notRequired(),
  }),
}).defined();

export type FormValues = InferType<typeof validationSchema>;
