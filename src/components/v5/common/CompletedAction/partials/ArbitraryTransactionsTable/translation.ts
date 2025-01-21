import { defineMessages } from 'react-intl';

import { displayName } from './const.ts';

export const MSG = defineMessages({
  transactionByteData: {
    id: `${displayName}.transactionByteData`,
    defaultMessage: 'Transaction byte data',
  },
  expand: {
    id: `${displayName}.expand`,
    defaultMessage: 'Expand',
  },
  hide: {
    id: `${displayName}.hide`,
    defaultMessage: 'Hide',
  },
});
