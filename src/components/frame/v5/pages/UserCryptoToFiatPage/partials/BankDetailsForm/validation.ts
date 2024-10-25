import { type InferType, object, string } from 'yup';

import { CURRENCY_VALUES } from '~frame/v5/pages/UserCryptoToFiatPage/constants.ts';
import { SupportedCurrencies } from '~gql';
import { formErrorMessage, formatText } from '~utils/intl.ts';
import { capitalizeFirstLetter } from '~utils/strings.ts';

import {
  BANK_DETAILS_FORM_FIELD_VALUE_LENGTHS,
  BANK_DETAILS_FORM_MSG,
  ALPHANUMERIC_WITH_SEPARATORS_REGEX,
  SEPARATOR_REGEX,
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

const { accountNumber, routingNumber, swift } =
  BANK_DETAILS_FORM_FIELD_VALUE_LENGTHS;

const stripSeparators = (value: string) => value.replace(SEPARATOR_REGEX, '');

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
        ALPHANUMERIC_WITH_SEPARATORS_REGEX,
        formatText(BANK_DETAILS_FORM_MSG.alphanumeric),
      )
      .test(
        'is-valid-iban',
        formErrorMessage(BANK_DETAILS_FORM_MSG.ibanLabel, 'invalid'),
        (value) => {
          if (!value) {
            return false;
          }

          // Strip separators before validating
          const cleanedValue = stripSeparators(value);

          return IBAN_REGEX.test(cleanedValue);
        },
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
        ALPHANUMERIC_WITH_SEPARATORS_REGEX,
        formatText(BANK_DETAILS_FORM_MSG.alphanumeric),
      )
      .test(
        'is-valid-swift',
        formErrorMessage(BANK_DETAILS_FORM_MSG.swiftLabel, 'invalid'),
        (value) => {
          if (!value) {
            return false;
          }

          // Strip separators before validating
          const cleanedValue = stripSeparators(value);

          return swift.lengths.includes(cleanedValue.length);
        },
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
          ALPHANUMERIC_WITH_SEPARATORS_REGEX,
          formatText(BANK_DETAILS_FORM_MSG.alphanumeric),
        )
        .test(
          'is-valid-account-number',
          capitalizeFirstLetter(
            formErrorMessage(
              BANK_DETAILS_FORM_MSG.accountNumberLabel,
              'invalid',
            ),
            { lowerCaseRemainingLetters: true },
          ),
          (value) => {
            if (!value) {
              return false;
            }

            // Strip separators before validating
            const cleanedValue = stripSeparators(value);

            return (
              cleanedValue.length >= accountNumber.min &&
              cleanedValue.length <= accountNumber.max
            );
          },
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
          ALPHANUMERIC_WITH_SEPARATORS_REGEX,
          formatText(BANK_DETAILS_FORM_MSG.alphanumeric),
        )
        .test(
          'is-valid-routing-number',
          capitalizeFirstLetter(
            formErrorMessage(
              BANK_DETAILS_FORM_MSG.routingNumberLabel,
              'invalid',
            ),
            { lowerCaseRemainingLetters: true },
          ),
          (value) => {
            if (!value) {
              return false;
            }

            // Strip separators before validating
            const cleanedValue = stripSeparators(value);

            return cleanedValue.length === routingNumber.length;
          },
        ),
      otherwise: string().notRequired(),
    },
  ),
}).defined();

export type BankDetailsFormSchema = InferType<typeof validationSchema>;
