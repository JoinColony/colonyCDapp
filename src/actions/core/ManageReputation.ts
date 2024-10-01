import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import ManageReputationForm from '~v5/common/ActionSidebar/partials/forms/core/ManageReputationForm/ManageReputationForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: ManageReputationForm,
  name: {
    id: 'actions.core.manageReputation',
    defaultMessage: 'Manage reputation',
  },
  // FIXME: This depends on what we want to do:
  // // Manage Reputation requires a different role dependant on awarding / removing
  // ManageReputationAward: [[ColonyRole.Root]],
  // ManageReputationRemove: [[ColonyRole.Arbitration]],
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreAction.ManageReputation,
});
