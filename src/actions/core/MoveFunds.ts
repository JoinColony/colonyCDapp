import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions';
import TransferFundsForm from '~v5/common/ActionSidebar/partials/forms/core/TransferFundsForm/TransferFundsForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.MoveFunds.name',
    defaultMessage: 'Transfer funds',
  },
  title: {
    id: 'actions.core.MoveFunds.title',
    defaultMessage:
      'Move {amount} {tokenSymbol} from {fromDomain} to {toDomain} by {initiator}}',
  },
});

registerAction({
  component: TransferFundsForm,
  name: MSG.name,
  requiredPermissions: [[ColonyRole.Funding]],
  title: MSG.title,
  titleKeys: [
    ActionTitleKey.Amount,
    ActionTitleKey.TokenSymbol,
    ActionTitleKey.FromDomain,
    ActionTitleKey.ToDomain,
    ActionTitleKey.Initiator,
  ],
  type: CoreAction.MoveFunds,
});
