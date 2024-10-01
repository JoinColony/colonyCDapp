import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import UnlockTokenForm from '~v5/common/ActionSidebar/partials/forms/core/UnlockTokenForm/UnlockTokenForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: UnlockTokenForm,
  name: {
    id: 'actions.core.unlockToken',
    defaultMessage: 'Transfer funds',
  },
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreAction.UnlockToken,
});
