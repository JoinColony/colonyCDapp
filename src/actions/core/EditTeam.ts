import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import { CREATED_IN_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import EditTeamForm from '~v5/common/ActionSidebar/partials/forms/core/EditTeamForm/EditTeamForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: EditTeamForm,
  name: {
    id: 'actions.core.editTeam',
    defaultMessage: 'Edit team',
  },
  requiredPermissions: [[ColonyRole.Architecture]],
  permissionDomainId: ({ watch }) => watch(CREATED_IN_FIELD_NAME),
  type: CoreAction.EditDomain,
});
