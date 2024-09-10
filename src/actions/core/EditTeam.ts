import { ColonyRole } from '@colony/colony-js';

import { type ActionDefinition } from '~actions/utils.ts';
import EditTeam from '~v5/common/ActionSidebar/partials/forms/core/EditTeam/EditTeam.tsx';

const formDefinition: ActionDefinition = {
  component: EditTeam,
  name: {
    id: 'actions.core.editTeam',
    defaultMessage: 'Edit team',
  },
  requiredPermissions: [[ColonyRole.Architecture]],
  permissionDomainId: ({ watch }) => watch('createdIn'),
};

export default formDefinition;
