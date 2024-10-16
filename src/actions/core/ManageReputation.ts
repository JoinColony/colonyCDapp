import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions';
import { DecisionMethod } from '~gql';
import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  TEAM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import ManageReputationForm from '~v5/common/ActionSidebar/partials/forms/core/ManageReputationForm/ManageReputationForm.tsx';

import { CoreAction, CoreActionGroup } from './types.ts';

const MSG = defineMessages({
  groupName: {
    id: 'actions.core.group.ManageReputation',
    defaultMessage: 'Manage reputation',
  },
  awardName: {
    id: 'actions.core.EmitDomainReputationReward.name',
    defaultMessage: 'Award reputation',
  },
  awardTitle: {
    id: 'action.core.EmitDomainReputationReward.title',
    defaultMessage:
      'Add {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} to {recipient} by {initiator}',
  },
  smiteName: {
    id: 'actions.core.EmitDomainReputationPenalty.name',
    defaultMessage: 'Smite reputation',
  },
  smiteTitle: {
    id: 'actions.core.EmitDomainReputationPenalty.title',
    defaultMessage:
      'Remove {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} from {recipient} by {initiator}',
  },
});

registerAction({
  component: ManageReputationForm,
  name: MSG.groupName,
  permissionDomainId: ({ watch }) => {
    const decisionMethod = watch(DECISION_METHOD_FIELD_NAME);
    if (decisionMethod !== DecisionMethod.Reputation) {
      return watch(TEAM_FIELD_NAME);
    }
    return watch(CREATED_IN_FIELD_NAME);
  },
  actions: {
    EmitDomainReputationReward: {
      name: MSG.awardName,
      requiredPermissions: [[ColonyRole.Root]],
      title: MSG.awardTitle,
      titleKeys: [
        ActionTitleKey.Recipient,
        ActionTitleKey.ReputationChangeNumeral,
        ActionTitleKey.ReputationChange,
        ActionTitleKey.Initiator,
      ],
      type: CoreAction.EmitDomainReputationReward,
    },
    EmitDomainReputationPenalty: {
      name: MSG.smiteName,
      requiredPermissions: [[ColonyRole.Arbitration]],
      title: MSG.smiteTitle,
      titleKeys: [
        ActionTitleKey.Recipient,
        ActionTitleKey.ReputationChangeNumeral,
        ActionTitleKey.ReputationChange,
        ActionTitleKey.Initiator,
      ],
      type: CoreAction.EmitDomainReputationPenalty,
    },
  },
  type: CoreActionGroup.ManageReputation,
});
