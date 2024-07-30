import { type InferType, object, string } from 'yup';

import { CURRENCY_VALUES } from '~frame/v5/pages/UserCryptoToFiatPage/constants.ts';
import { SupportedCurrencies } from '~gql';
import { formErrorMessage, formatText } from '~utils/intl.ts';
import { capitalizeFirstLetter } from '~utils/strings.ts';

import {
  BANK_DETAILS_FORM_FIELD_VALUE_LENGTHS,
  BANK_DETAILS_FORM_MSG,
  BIC_REGEX,
  IBAN_REGEX,
} from './constants.ts';

export enum BankDetailsFields {
  ACCOUNT_OWNER = 'accountOwner',
  BANK_NAME = 'bankName',
  CURRENCY = 'currency',
  COUNTRY = 'country',
  IBAN = 'iban',
  SWIFT = 'swift',
  ACCOUNT_NUMBER = 'accountNumber',
  ROUTING_NUMBER = 'routingNumber',
}

const { accountNumber, routingNumber } = BANK_DETAILS_FORM_FIELD_VALUE_LENGTHS;

export const validationSchema = object({
  [BankDetailsFields.ACCOUNT_OWNER]: string().required(
    formatText({ id: 'cryptoToFiat.forms.error.bankAccount.accountOwner' }),
  ),
  [BankDetailsFields.BANK_NAME]: string().required(
    formatText({ id: 'cryptoToFiat.forms.error.bankAccount.bankName' }),
  ),
  [BankDetailsFields.CURRENCY]: string().required(
    formatText({ id: 'cryptoToFiat.forms.error.bankAccount.currency' }),
  ),
  [BankDetailsFields.COUNTRY]: string().when(BankDetailsFields.CURRENCY, {
    is: CURRENCY_VALUES[SupportedCurrencies.Eur],
    then: string().required(
      formatText({
        id: 'cryptoToFiat.forms.error.bankAccount.country',
      }),
    ),
    otherwise: string().notRequired(),
  }),
  [BankDetailsFields.IBAN]: string().when(BankDetailsFields.CURRENCY, {
    is: CURRENCY_VALUES[SupportedCurrencies.Eur],
    then: string()
      .required(
        formatText({
          id: 'cryptoToFiat.forms.error.bankAccount.iban',
        }),
      )
      .matches(
        IBAN_REGEX,
        formErrorMessage(BANK_DETAILS_FORM_MSG.ibanLabel, 'invalid'),
      ),
    otherwise: string().notRequired(),
  }),
  [BankDetailsFields.SWIFT]: string().when(BankDetailsFields.CURRENCY, {
    is: CURRENCY_VALUES[SupportedCurrencies.Eur],
    then: string()
      .required(
        formatText({
          id: 'cryptoToFiat.forms.error.bankAccount.swift',
        }),
      )
      .matches(
        BIC_REGEX,
        formErrorMessage(BANK_DETAILS_FORM_MSG.swiftLabel, 'invalid'),
      ),
    otherwise: string().notRequired(),
  }),
  [BankDetailsFields.ACCOUNT_NUMBER]: string().when(
    BankDetailsFields.CURRENCY,
    {
      is: CURRENCY_VALUES[SupportedCurrencies.Usd],
      then: string()
        .required(
          formatText({
            id: 'cryptoToFiat.forms.error.bankAccount.accountNumber',
          }),
        )
        .matches(
          /^[0-9]+$/,
          capitalizeFirstLetter(
            formErrorMessage(
              BANK_DETAILS_FORM_MSG.accountNumberLabel,
              'invalid',
            ),
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
            'max',
            accountNumber.max,
          ),
        ),
      otherwise: string().notRequired(),
    },
  ),
  [BankDetailsFields.ROUTING_NUMBER]: string().when(
    BankDetailsFields.CURRENCY,
    {
      is: CURRENCY_VALUES[SupportedCurrencies.Usd],
      then: string()
        .required(
          formatText({
            id: 'cryptoToFiat.forms.error.bankAccount.routingNumber',
          }),
        )
        .matches(
          /^[0-9]+$/,
          capitalizeFirstLetter(
            formErrorMessage(
              BANK_DETAILS_FORM_MSG.routingNumberLabel,
              'invalid',
            ),
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
    },
  ),
}).defined();

export type BankDetailsFormSchema = InferType<typeof validationSchema>;
