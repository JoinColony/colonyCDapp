import { defineMessages } from 'react-intl';

export const ALPHANUMERIC_WITH_SEPARATORS_REGEX = /^[A-Za-z0-9 -]*$/;

export const NUMERIC_WITH_SEPARATORS_REGEX = /^[0-9 -]*$/;

export const SEPARATOR_REGEX = /[ -]/g;

// Strip any separators before comparing against this regex
// 1.	Two uppercase letters at the start (for the country code).
// 2.	Two digits immediately following (for the checksum).
// 3.	11–30 alphanumeric characters after that, allowing for a total length of 15–34 characters.
export const IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;

export const displayName =
  'v5.pages.UserCryptoToFiatPage.partials.BankDetailsForm';

export const BANK_DETAILS_FORM_MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Bank details',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage:
      'Complete your bank, and currency information to receive USDC payments to your bank account.',
  },
  cancelButtonTitle: {
    id: `${displayName}.cancelButtonTitle`,
    defaultMessage: 'Cancel',
  },
  proceedButtonTitle: {
    id: `${displayName}.proceedButtonTitle`,
    defaultMessage: 'Submit details',
  },
  accountOwnerNameLabel: {
    id: `${displayName}.accountOwnerNameLabel`,
    defaultMessage: 'Account owner name',
  },
  accountOwnerNamePlaceholder: {
    id: `${displayName}.accountOwnerNamePlaceholder`,
    defaultMessage: 'Full name',
  },
  bankAccountLabel: {
    id: `${displayName}.bankAccountLabel`,
    defaultMessage: 'Bank account',
  },
  bankNameLabel: {
    id: `${displayName}.bankNameLabel`,
    defaultMessage: 'Bank name',
  },
  bankNamePlaceholder: {
    id: `${displayName}.bankNamePlaceholder`,
    defaultMessage: 'Bank name',
  },
  payoutCurrencyLabel: {
    id: `${displayName}.payoutCurrencyLabel`,
    defaultMessage: 'Payout currency',
  },
  payoutCurrencyPlaceholder: {
    id: `${displayName}.payoutCurrencyPlaceholder`,
    defaultMessage: 'Select payout currency',
  },
  countryLabel: {
    id: `${displayName}.countryLabel`,
    defaultMessage: 'Country',
  },
  countryPlaceholder: {
    id: `${displayName}.countryPlaceholder`,
    defaultMessage: 'Select country',
  },
  ibanLabel: {
    id: `${displayName}.ibanLabel`,
    defaultMessage: 'IBAN',
  },
  swiftLabel: {
    id: `${displayName}.swiftLabel`,
    defaultMessage: 'SWIFT/BIC',
  },
  accountNumberLabel: {
    id: `${displayName}.accountNumberLabel`,
    defaultMessage: 'Account number',
  },
  routingNumberLabel: {
    id: `${displayName}.routingNumberLabel`,
    defaultMessage: 'Routing number',
  },
  alphanumeric: {
    id: `${displayName}.alphanumeric`,
    defaultMessage: 'Please enter only letters and numbers',
  },
  numeric: {
    id: `${displayName}.numeric`,
    defaultMessage: 'Please enter only numbers',
  },
});

export const BANK_DETAILS_FORM_FIELD_VALUE_LENGTHS = {
  accountNumber: {
    min: 6,
    max: 17,
  },
  routingNumber: {
    length: 9,
  },
  swift: {
    lengths: [8, 11],
  },
};
