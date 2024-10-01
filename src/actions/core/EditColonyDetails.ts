import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import EditColonyDetailsForm from '~v5/common/ActionSidebar/partials/forms/core/EditColonyDetailsForm/EditColonyDetailsForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: EditColonyDetailsForm,
  name: {
    id: 'actions.core.editColonyDetails',
    defaultMessage: 'Edit Colony details',
  },
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreAction.ColonyEdit,
});
