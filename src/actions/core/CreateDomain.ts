import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions';
import { CREATED_IN_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import CreateTeamForm from '~v5/common/ActionSidebar/partials/forms/core/CreateTeamForm/CreateTeamForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.CreateDomain.name',
    defaultMessage: 'Create new team',
  },
  title: {
    id: 'actions.core.CreateDomain.title',
    defaultMessage: 'Create new team {fromDomain} by {initiator}',
  },
});

registerAction({
  component: CreateTeamForm,
  name: MSG.name,
  requiredPermissions: [[ColonyRole.Architecture]],
  permissionDomainId: ({ watch }) => watch(CREATED_IN_FIELD_NAME),
  title: MSG.title,
  titleKeys: [ActionTitleKey.FromDomain, ActionTitleKey.Initiator],
  type: CoreAction.CreateDomain,
});
