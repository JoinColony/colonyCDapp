import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { Decimal } from 'decimal.js';
import { BigNumber } from 'ethers';

import { type ColonyMotion } from '~types/graphql.ts';

export enum MotionVote {
  Yay = 1,
  Nay = 0,
}

export const noMotionsVotingReputationVersion = 4;

export enum MotionState {
  Supported = 'Supported',
  Staking = 'Staking',
  Voting = 'Voting',
  Reveal = 'Reveal',
  Opposed = 'Opposed',
  Motion = 'Motion', // @TODO: This was used by the old MotionTag component and should be removed
  Failed = 'Failed',
  Finalizable = 'Finalizable',
  Passed = 'Passed',
  FailedNotFinalizable = 'FailedNotFinalizable',
  Invalid = 'Invalid',
  Escalated = 'Escalated',
  Forced = 'Forced',
  Draft = 'Draft',
  Rejected = 'Rejected',
  Open = 'Open',
  Unknown = 'Unknown',
  Uninstalled = 'Uninstalled',
}

export const getMotionDatabaseId = (
  chainId: number,
  votingRepExtnAddress: string,
  nativeMotionId: BigNumber,
): string => `${chainId}-${votingRepExtnAddress}_${nativeMotionId}`;

export const getMotionState = (
  motionState: NetworkMotionState | number,
  {
    motionStakes: {
      raw: { yay: yayStakes, nay: nayStakes },
    },
    requiredStake,
    revealedVotes: {
      raw: { yay: yayVotes, nay: nayVotes },
    },
  }: Pick<ColonyMotion, 'motionStakes' | 'requiredStake' | 'revealedVotes'>,
) => {
  switch (motionState) {
    case NetworkMotionState.Null: {
      return MotionState.Uninstalled;
    }
    case NetworkMotionState.Staking: {
      if (
        BigNumber.from(nayStakes).gte(requiredStake) &&
        BigNumber.from(yayStakes).isZero()
      ) {
        return MotionState.Opposed;
      }
      return BigNumber.from(yayStakes).gte(requiredStake) &&
        BigNumber.from(nayStakes).isZero()
        ? MotionState.Supported
        : MotionState.Staking;
    }
    case NetworkMotionState.Submit: {
      return MotionState.Voting;
    }
    case NetworkMotionState.Reveal: {
      return MotionState.Reveal;
    }
    case NetworkMotionState.Closed: {
      return MotionState.Escalated;
    }
    case NetworkMotionState.Finalizable: {
      return MotionState.Finalizable;
    }
    case NetworkMotionState.Finalized: {
      /*
       * Both sides staked fully, we go to a vote
       *
       * @TODO We're using gte as opposed to just eq to counteract a bug on the contracts
       * Once that is fixed, we can switch this back to equals
       */
      if (
        BigNumber.from(nayStakes).gte(requiredStake) &&
        BigNumber.from(yayStakes).gte(requiredStake)
      ) {
        /*
         * It only passes if the yay votes outnumber the nay votes
         * If the votes are equal, it fails
         */
        if (BigNumber.from(yayVotes).gt(nayVotes)) {
          return MotionState.Passed;
        }

        return MotionState.Failed;
      }

      if (BigNumber.from(yayStakes).eq(requiredStake)) {
        return MotionState.Passed;
      }
      return MotionState.Failed;
    }
    case NetworkMotionState.Failed:
      return MotionState.FailedNotFinalizable;
    default:
      return MotionState.Invalid;
  }
};

export const getMotionRequiredStake = (
  skillRep: BigNumber,
  totalStakeFraction: BigNumber,
  decimals: number,
): BigNumber => {
  const requiredStake = skillRep
    .mul(totalStakeFraction)
    .div(BigNumber.from(10).pow(decimals));
  return requiredStake;
};

const ONE_SECOND = 1000;
export const getEarlierEventTimestamp = (
  currentTimestamp: number,
  subTime = ONE_SECOND,
) => {
  return currentTimestamp - subTime;
};

export const shouldDisplayMotionInActionsList = (
  currentStake: string,
  requiredStake: string,
): boolean => {
  if (requiredStake === '0') return true;
  return new Decimal(currentStake)
    .div(new Decimal(requiredStake))
    .times(100)
    .gte(10);
};

export interface MotionValue {
  motionId: number;
}
