import { SelectOption } from '~v5/common/Fields/Select/types';

export const manageMemberActions: SelectOption[] = [
  {
    label: 'Ban this member from chat access',
    value: 'ban',
  },
  {
    label: 'Unban this member and allow chat access',
    value: 'unban',
  },
  {
    label: 'Reduce member’s reputation',
    value: 'reduceReputation',
  },
  {
    label: 'Award member with reputation',
    value: 'awardReputation',
  },
  {
    label: 'Add member to the verified members',
    value: 'addVerifiedMember',
  },
  {
    label: 'Remove from the verified members',
    value: 'removeVerifiedMember',
  },
  {
    label: 'Edit this member’s permissions',
    value: 'editPermissions',
  },
];
