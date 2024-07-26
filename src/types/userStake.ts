import { type UserStake } from './graphql.ts';

export enum UserStakeStatus {
  Staking = 'Staking',
  Finalizable = 'Finalizable',
  Claimable = 'Claimable',
  Claimed = 'Claimed',
  Unknown = 'Unknown',
  Uninstalled = 'Uninstalled',
}

export interface UserStakeWithStatus extends UserStake {
  status: UserStakeStatus;
}
