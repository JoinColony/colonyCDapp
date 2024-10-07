import { defineMessages } from 'react-intl';

import { registerAction } from '~actions/index.ts';

import { CoreActionGroup } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.StreamingPayment.name',
    defaultMessage: 'Streaming payment',
  },
});

registerAction({
  name: MSG.name,
  type: CoreActionGroup.StreamingPayment,
});
