import { ContributorType } from '~gql';

export const membersList = [
  {
    userName: 'John Doe',
    address: '0x1234567890123456789012345678901234567890',
    hasSigned: false,
    key: '1',
    contributorType: ContributorType.Active,
  },
  {
    userName: 'Andrew Doe',
    address: '0x12345678901234567890',
    hasSigned: false,
    key: '2',
    contributorType: ContributorType.General,
  },
  {
    userName: 'Thomas Doe',
    address: '0x1234567890',
    hasSigned: false,
    key: '3',
    contributorType: ContributorType.Dedicated,
  },
];
