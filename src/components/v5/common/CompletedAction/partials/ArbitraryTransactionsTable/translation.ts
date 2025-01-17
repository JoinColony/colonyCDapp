import { defineMessages } from 'react-intl';

import { displayName } from './const.ts';

export const MSG = defineMessages({
  noAbi: {
    id: `${displayName}.noAbi`,
    defaultMessage: 'No ABI found',
  },
  transactionByteData: {
    id: `${displayName}.transactionByteData`,
    defaultMessage: 'Transaction byte data',
  },
});
