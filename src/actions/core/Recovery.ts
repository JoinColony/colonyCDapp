import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions';
import EnterRecoveryModeForm from '~v5/common/ActionSidebar/partials/forms/core/EnterRecoveryModeForm/EnterRecoveryModeForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.Recovery.name',
    defaultMessage: 'Enter recovery mode',
  },
  title: {
    id: 'actions.core.Recovery.title',
    defaultMessage: 'Enter recovery mode by {initiator}',
  },
});

registerAction({
  component: EnterRecoveryModeForm,
  name: MSG.name,
  requiredPermissions: [[ColonyRole.Root]],
  title: MSG.title,
  titleKeys: [ActionTitleKey.Initiator],
  type: CoreAction.Recovery,
});
