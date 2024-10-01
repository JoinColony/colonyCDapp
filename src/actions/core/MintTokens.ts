import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import MintTokenForm from '~v5/common/ActionSidebar/partials/forms/core/MintTokenForm/MintTokenForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: MintTokenForm,
  name: {
    id: 'actions.core.mintTokens',
    defaultMessage: 'Mint tokens',
  },
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreAction.MintTokens,
});
