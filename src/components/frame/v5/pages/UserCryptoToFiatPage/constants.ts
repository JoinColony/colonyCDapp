import { defineMessages } from 'react-intl';

const displayName = 'v5.pages.UserCryptoToFiatPage';

export const BANK_DETAILS_ROW_ITEM = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Bank details',
  },
  headingAccessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Required',
  },
});

export const VERIFICATION_ROW_ITEM = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Verification',
  },
  headingAccessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Required',
  },
});

export const AUTOMATIC_DEPOSITS_ROW_ITEM = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Enable automatic deposits',
  },
  headingAccessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Optional',
  },
});
