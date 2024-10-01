import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import ManageTokensForm from '~v5/common/ActionSidebar/partials/forms/core/ManageTokensForm/ManageTokensForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: ManageTokensForm,
  name: {
    id: 'actions.core.manageTokens',
    defaultMessage: 'Manage tokens',
  },
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreAction.ManageTokens,
});
