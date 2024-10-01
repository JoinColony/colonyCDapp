import { registerAction } from '~actions/utils.ts';

import { CoreAction } from './types.ts';

registerAction({
  name: {
    id: 'actions.core.stagedPayment',
    defaultMessage: 'Staged payment',
  },
  type: CoreAction.StagedPayment,
});
