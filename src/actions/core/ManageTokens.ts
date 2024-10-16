import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { registerAction } from '~actions';
import ManageTokensForm from '~v5/common/ActionSidebar/partials/forms/core/ManageTokensForm/ManageTokensForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.ManageTokens.name',
    defaultMessage: 'Manage tokens',
  },
});

registerAction({
  component: ManageTokensForm,
  name: MSG.name,
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreAction.ManageTokens,
});
