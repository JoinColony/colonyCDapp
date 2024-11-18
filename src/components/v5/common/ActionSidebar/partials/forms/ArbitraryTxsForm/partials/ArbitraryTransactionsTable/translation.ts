import { defineMessages } from 'react-intl';

export const displayName =
  'v5.common.ActionsContent.partials.ArbitraryTransactionsTable';

export const MSG = defineMessages({
  contractModalCancelTitle: {
    id: `${displayName}.contractModalCancelTitle`,
    defaultMessage: 'Do you wish to cancel the arbitrary transaction creation?',
  },

  contractModalCancelSubtitle: {
    id: `${displayName}.contractModalCancelSubtitle`,
    defaultMessage: 'All entered data will be lost.',
  },

  contractModalCancelButtonCancel: {
    id: `${displayName}.contractModalCancelButtonCancel`,
    defaultMessage: 'Yes, cancel the form creation',
  },

  contractModalCancelButtonContinue: {
    id: `${displayName}.contractModalCancelButtonContinue`,
    defaultMessage: 'No, go back to editing',
  },
});
