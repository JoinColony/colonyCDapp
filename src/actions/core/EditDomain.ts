import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions';
import { DecisionMethod } from '~gql';
import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  TEAM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import EditTeamForm from '~v5/common/ActionSidebar/partials/forms/core/EditTeamForm/EditTeamForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.EditDomain.name',
    defaultMessage: 'Edit team',
  },
  title: {
    id: 'actions.core.EditDomain.title',
    defaultMessage: 'Change {fromDomain} team details by {initiator}',
  },
});

registerAction({
  component: EditTeamForm,
  name: MSG.name,
  permissionDomainId: ({ watch }) => {
    const decisionMethod = watch(DECISION_METHOD_FIELD_NAME);
    if (decisionMethod !== DecisionMethod.Reputation) {
      return watch(TEAM_FIELD_NAME);
    }
    return watch(CREATED_IN_FIELD_NAME);
  },
  requiredPermissions: [[ColonyRole.Architecture]],
  title: MSG.title,
  titleKeys: [ActionTitleKey.FromDomain, ActionTitleKey.Initiator],
  type: CoreAction.EditDomain,
});
