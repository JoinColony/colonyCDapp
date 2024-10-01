import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import ManageVerifiedMembersForm from '~v5/common/ActionSidebar/partials/forms/core/ManageVerifiedMembersForm/ManageVerifiedMembersForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: ManageVerifiedMembersForm,
  name: {
    id: 'actions.core.manageVerifiedMembers',
    defaultMessage: 'Manage verified members',
  },
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreAction.ManageVerifiedMembers,
});
