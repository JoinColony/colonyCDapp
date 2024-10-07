import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions/index.ts';
import UnlockTokenForm from '~v5/common/ActionSidebar/partials/forms/core/UnlockTokenForm/UnlockTokenForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.UnlockToken.name',
    defaultMessage: 'Unlock token',
  },
  title: {
    id: 'actions.core.UnlockToken.title',
    defaultMessage: 'Unlock native token {tokenSymbol} by {initiator}',
  },
});

registerAction({
  component: UnlockTokenForm,
  name: MSG.name,
  requiredPermissions: [[ColonyRole.Root]],
  title: MSG.title,
  titleKeys: [ActionTitleKey.TokenSymbol, ActionTitleKey.Initiator],
  type: CoreAction.UnlockToken,
});
