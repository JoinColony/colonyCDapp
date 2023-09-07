import { ManageMemberListProps } from './types';

export const manageMemberActions: ManageMemberListProps[] = [
  {
    id: 0,
    label: 'Ban this member from chat access',
    value: 'ban',
  },
  {
    id: 1,
    label: 'Unban this member and allow chat access',
    value: 'unban',
  },
  {
    id: 2,
    label: 'Reduce member’s reputation',
    value: 'reduceReputation',
  },
  {
    id: 3,
    label: 'Award member with reputation',
    value: 'awardReputation',
  },
  {
    id: 4,
    label: 'Add member to the verified members',
    value: 'addVerifiedMember',
  },
  {
    id: 5,
    label: 'Remove from the verified members',
    value: 'removeVerifiedMember',
  },
  {
    id: 6,
    label: 'Edit this member’s permissions',
    value: 'editPermissions',
  },
];
