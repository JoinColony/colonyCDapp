import { defineMessages } from 'react-intl';

export const IBAN_REGEX =
  /^([A-Z]{2}[ +\\-]?[0-9]{2})(?=(?:[ +\\-]?[A-Z0-9]){9,30}$)((?:[ +\\-]?[A-Z0-9]{3,5}){2,7})([ +\\-]?[A-Z0-9]{1,3})?$/;

export const BIC_REGEX =
  // eslint-disable-next-line max-len
  /^([a-zA-Z]{4})([a-zA-Z]{2})(([2-9a-zA-Z]{1})([0-9a-np-zA-NP-Z]{1}))((([0-9a-wy-zA-WY-Z]{1})([0-9a-zA-Z]{2}))|([xX]{3})?)$/;

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
});

export const VALIDATION_MSG = defineMessages({
  required: {
    id: 'bankDetailsForm.validation.required',
    defaultMessage: '{field} is a required field',
  },
});

export const BANK_DETAILS_FORM_FIELD_VALUE_LENGTHS = {
  accountNumber: {
    min: 8,
    max: 17,
  },
  routingNumber: {
    length: 9,
  },
};
