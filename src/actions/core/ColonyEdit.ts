import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions';
import EditColonyDetailsForm from '~v5/common/ActionSidebar/partials/forms/core/EditColonyDetailsForm/EditColonyDetailsForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.ColonyEdit.name',
    defaultMessage: 'Edit Colony details',
  },
  title: {
    id: 'actions.core.ColonyEdit.title',
    defaultMessage: 'Edit details of the Colony by {initiator}',
  },
});

registerAction({
  component: EditColonyDetailsForm,
  name: MSG.name,
  requiredPermissions: [[ColonyRole.Root]],
  title: MSG.title,
  titleKeys: [ActionTitleKey.Initiator],
  type: CoreAction.ColonyEdit,
});
