import { defineMessages } from 'react-intl';

const displayName = 'v5.pages.UserCryptoToFiatpage.partials.ContactDetailsForm';

export const CONTACT_DETAILS_FORM_MSGS = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Contact details',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage:
      'The address details provided should match your bank account details. This information is only provided to Bridge and not stored by Colony',
  },
  cancelButtonTitle: {
    id: `${displayName}.cancelButtonTitle`,
    defaultMessage: 'Cancel',
  },
  proceedButtonTitle: {
    id: `${displayName}.proceedButtonTitle`,
    defaultMessage: 'Submit details',
  },
  addressLabel: {
    id: `${displayName}.addressLabel`,
    defaultMessage: 'Address',
  },
  address1Label: {
    id: `${displayName}.address1Placeholder`,
    defaultMessage: 'Address',
  },
  address1Placeholder: {
    id: `${displayName}.address1Placeholder`,
    defaultMessage: 'Street line one',
  },
  address2Label: {
    id: `${displayName}.address2Placeholder`,
    defaultMessage: 'Address 2',
  },
  address2Placeholder: {
    id: `${displayName}.address2Placeholder`,
    defaultMessage: 'Street line two',
  },
  cityLabel: {
    id: `${displayName}.cityLabel`,
    defaultMessage: 'City',
  },
  cityPlaceholder: {
    id: `${displayName}.cityPlaceholder`,
    defaultMessage: 'City',
  },
  postcodeLabel: {
    id: `${displayName}.postcodeLabel`,
    defaultMessage: 'Postcode',
  },
  postcodePlaceholder: {
    id: `${displayName}.postcodePlaceholder`,
    defaultMessage: 'Postcode',
  },
  dobLabel: {
    id: `${displayName}.dobLabel`,
    defaultMessage: 'Date of birth',
  },
  dobPlaceholder: {
    id: `${displayName}.dobPlaceholder`,
    defaultMessage: 'YYYY-MM-DD',
  },
  taxLabel: {
    id: `${displayName}.taxLabel`,
    defaultMessage:
      'Tax identification number (eg. social security number or EIN)',
  },
  taxPlaceholder: {
    id: `${displayName}.taxPlaceholder`,
    defaultMessage: 'Tax identification number',
  },
  countryLabel: {
    id: `${displayName}.country`,
    defaultMessage: 'Country',
  },
  countryPlaceholder: {
    id: `${displayName}.countryPlaceholder`,
    defaultMessage: 'Select country',
  },
  stateLabel: {
    id: `${displayName}.stateLabel`,
    defaultMessage: 'State',
  },
  statePlaceholder: {
    id: `${displayName}.stateLabel`,
    defaultMessage: 'State',
  },
});
