import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions/index.ts';
import ManageVerifiedMembersForm from '~v5/common/ActionSidebar/partials/forms/core/ManageVerifiedMembersForm/ManageVerifiedMembersForm.tsx';

import { CoreAction, CoreActionGroup } from './types.ts';

const MSG = defineMessages({
  groupName: {
    id: 'actions.core.ManageVerifiedMembers.name',
    defaultMessage: 'Manage verified members',
  },
  addName: {
    id: 'actions.core.AddVerifiedMembers.name',
    defaultMessage: 'Add verified members',
  },
  addTitle: {
    id: 'action.core.AddVerifiedMembers.title',
    defaultMessage:
      'Add {members} verified {members, plural, one {member} other {members}} by {initiator}',
  },
  removeName: {
    id: 'actions.core.RemoveVerifiedMembers.name',
    defaultMessage: 'Remove verified members',
  },
  removeTitle: {
    id: 'actions.core.RemoveVerifiedMembers.title',
    defaultMessage:
      'Remove {members} verified {members, plural, one {member} other {members}} by {initiator}',
  },
});

registerAction({
  actions: {
    EmitDomainReputationReward: {
      name: MSG.addName,
      requiredPermissions: [[ColonyRole.Root]],
      title: MSG.addTitle,
      titleKeys: [ActionTitleKey.Members, ActionTitleKey.Initiator],
      type: CoreAction.AddVerifiedMembers,
    },
    EmitDomainReputationPenalty: {
      name: MSG.removeName,
      requiredPermissions: [[ColonyRole.Arbitration]],
      title: MSG.removeTitle,
      titleKeys: [ActionTitleKey.Members, ActionTitleKey.Initiator],
      type: CoreAction.RemoveVerifiedMembers,
    },
  },
  component: ManageVerifiedMembersForm,
  name: MSG.groupName,
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreActionGroup.ManageVerifiedMembers,
});
