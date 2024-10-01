import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import TransferFundsForm from '~v5/common/ActionSidebar/partials/forms/core/TransferFundsForm/TransferFundsForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: TransferFundsForm,
  name: {
    id: 'actions.core.transferFunds',
    defaultMessage: 'Transfer funds',
  },
  requiredPermissions: [[ColonyRole.Funding]],
  type: CoreAction.MoveFunds,
});
