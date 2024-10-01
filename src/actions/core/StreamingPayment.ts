import { registerAction } from '~actions/utils.ts';

import { CoreAction } from './types.ts';

registerAction({
  name: {
    id: 'actions.core.streamingPayment',
    defaultMessage: 'Streaming payment',
  },
  type: CoreAction.StreamingPayment,
});
