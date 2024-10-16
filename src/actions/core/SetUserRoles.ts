import { ColonyRole, Id } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions';
import { DecisionMethod } from '~gql';
import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  TEAM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import ManagePermissionsForm from '~v5/common/ActionSidebar/partials/forms/core/ManagePermissionsForm/ManagePermissionsForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.SetUserRoles.name',
    defaultMessage: 'Manage permissions',
  },
  title: {
    id: 'actions.core.SetUserRoles.title',
    defaultMessage:
      '{direction} {multiSigAuthority}permissions for {recipient} in {fromDomain} by {initiator}',
  },
});

registerAction({
  component: ManagePermissionsForm,
  name: MSG.name,
  title: MSG.title,
  titleKeys: [
    ActionTitleKey.Direction,
    ActionTitleKey.MultiSigAuthority,
    ActionTitleKey.Recipient,
    ActionTitleKey.FromDomain,
    ActionTitleKey.Initiator,
  ],
  permissionDomainId: () => {
    return Id.RootDomain;
  },
  requiredPermissions({ watch }) {
    const decisionMethod = watch(DECISION_METHOD_FIELD_NAME);
    const createdIn = watch(CREATED_IN_FIELD_NAME);
    const team = watch(TEAM_FIELD_NAME);

    let createdInDomain: number | undefined;
    if (decisionMethod === DecisionMethod.Reputation) {
      createdInDomain = team ? createdIn : undefined;
    } else {
      createdInDomain = team;
    }

    // If createdInDomain is undefined, return subdomain permissions
    if (createdInDomain === undefined) {
      return [[ColonyRole.Root], [ColonyRole.Architecture]];
    }

    // If assigning permissions in the root domain, the root role is required
    if (createdInDomain === Id.RootDomain) {
      return [[ColonyRole.Root]];
    }

    // When using multi-sig and not in root domain, the architecture role is required
    if (decisionMethod === DecisionMethod.MultiSig) {
      return [[ColonyRole.Architecture]];
    }

    // If assigning permissions in any other domain, root or architecture is required
    return [[ColonyRole.Root], [ColonyRole.Architecture]];
  },
  type: CoreAction.SetUserRoles,
});
