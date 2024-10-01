import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import EnterRecoveryModeForm from '~v5/common/ActionSidebar/partials/forms/core/EnterRecoveryModeForm/EnterRecoveryModeForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: EnterRecoveryModeForm,
  name: {
    id: 'actions.core.enterRecoveryMode',
    defaultMessage: 'Enter recovery mode',
  },
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreAction.Recovery,
});
