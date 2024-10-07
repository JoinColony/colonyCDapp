import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions/index.ts';
import MintTokenForm from '~v5/common/ActionSidebar/partials/forms/core/MintTokenForm/MintTokenForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.MintTokens.name',
    defaultMessage: 'Mint tokens',
  },
  title: {
    id: 'actions.core.MintTokens.title',
    defaultMessage: 'Mint {amount} {tokenSymbol} by {initiator}',
  },
});

registerAction({
  component: MintTokenForm,
  name: MSG.name,
  requiredPermissions: [[ColonyRole.Root]],
  title: MSG.title,
  titleKeys: [
    ActionTitleKey.Amount,
    ActionTitleKey.TokenSymbol,
    ActionTitleKey.Initiator,
  ],
  type: CoreAction.MintTokens,
});
