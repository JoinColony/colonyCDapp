import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import { CREATED_IN_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import CreateTeamForm from '~v5/common/ActionSidebar/partials/forms/core/CreateTeamForm/CreateTeamForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: CreateTeamForm,
  name: {
    id: 'actions.core.createTeam',
    defaultMessage: 'Create new team',
  },
  requiredPermissions: [[ColonyRole.Architecture]],
  permissionDomainId: ({ watch }) => watch(CREATED_IN_FIELD_NAME),
  type: CoreAction.CreateDomain,
});
