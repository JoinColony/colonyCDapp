import { UserStake } from './graphql';

export enum UserStakeStatus {
  Staking = 'Staking',
  Finalizable = 'Finalizable',
  Claimable = 'Claimable',
  Claimed = 'Claimed',
  Unknown = 'Unknown',
}

export interface UserStakeWithStatus extends UserStake {
  status: UserStakeStatus;
}
