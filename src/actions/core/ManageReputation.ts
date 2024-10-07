import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions/index.ts';
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
