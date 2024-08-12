import { defineMessages } from 'react-intl';

const displayname =
  'v5.pages.UserCryptoToFiatPage.partials.PersonalDetailsForm';

export const PERSONAL_DETAILS_FORM_MSGS = defineMessages({
  title: {
    id: `${displayname}.title`,
    defaultMessage: 'Personal details',
  },
  subtitle: {
    id: `${displayname}.subtitle`,
    defaultMessage:
      'The information is only provided to Bridge and not stored by Colony.',
  },
  cancelButtonTitle: {
    id: `${displayname}.cancelButtonTitle`,
    defaultMessage: 'Cancel',
  },
  proceedButtonTitle: {
    id: `${displayname}.proceedButtonTitle`,
    defaultMessage: `Next`,
  },
  firstNameLabel: {
    id: `${displayname}.firstNameLabel`,
    defaultMessage: 'First name',
  },
  firstNamePlaceholder: {
    id: `${displayname}.firstNamePlaceholder`,
    defaultMessage: 'First name',
  },
  lastNameLabel: {
    id: `${displayname}.lastNameLabel`,
    defaultMessage: 'Last name',
  },
  lastNamePlaceholder: {
    id: `${displayname}.lastNamePlaceholder`,
    defaultMessage: 'Last name',
  },
  emailLabel: {
    id: `${displayname}.emailLabel`,
    defaultMessage: 'Email address',
  },
  emailPlaceholder: {
    id: `${displayname}.emailPlaceholder`,
    defaultMessage: 'Email address',
  },
  countryLabel: {
    id: `${displayname}.countryLabel`,
    defaultMessage: 'Country',
  },
  postcodePlaceholder: {
    id: `${displayname}.postcodePlaceholder`,
    defaultMessage: 'Postcode',
  },
});
