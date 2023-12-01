import { defineMessages } from 'react-intl';
import { formatText } from '~utils/intl';
import { SelectOption } from '~v5/common/Fields/Select/types';

const actionMessages = defineMessages({
  banMember: {
    id: 'ManageMembers.Actions.Ban',
    defaultMessage: 'Ban this member from chat access',
  },
  unbanMember: {
    id: 'ManageMembers.Actions.Unban',
    defaultMessage: 'Unban this member and allow chat access',
  },
  reduceReputation: {
    id: 'ManageMembers.Actions.ReduceReputation',
    defaultMessage: 'Reduce member’s reputation',
  },
  awardReputation: {
    id: 'ManageMembers.Actions.AwardReputation',
    defaultMessage: 'Award member with reputation',
  },
  addVerifiedMember: {
    id: 'ManageMembers.Actions.AddVerified',
    defaultMessage: 'Add member to the verified members',
  },
  removeVerifiedMember: {
    id: 'ManageMembers.Actions.RemoveVerified',
    defaultMessage: 'Remove from the verified members',
  },
  editPermissions: {
    id: 'ManageMembers.Actions.EditPermissions',
    defaultMessage: 'Edit this member’s permissions',
  },
});

export const manageMemberActions: SelectOption[] = [
  {
    label: formatText(actionMessages.banMember) || '',
    value: 'ban',
  },
  {
    label: formatText(actionMessages.unbanMember) || '',
    value: 'unban',
  },
  {
    label: formatText(actionMessages.reduceReputation) || '',
    value: 'reduceReputation',
  },
  {
    label: formatText(actionMessages.awardReputation) || '',
    value: 'awardReputation',
  },
  {
    label: formatText(actionMessages.addVerifiedMember) || '',
    value: 'addVerifiedMember',
  },
  {
    label: formatText(actionMessages.removeVerifiedMember) || '',
    value: 'removeVerifiedMember',
  },
  {
    label: formatText(actionMessages.editPermissions) || '',
    value: 'editPermissions',
  },
];
