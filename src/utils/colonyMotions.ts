import { BigNumber } from 'ethers';
import { Decimal } from 'decimal.js';
import { MotionState as NetworkMotionState } from '@colony/colony-js';

import { ColonyMotion } from '~types';
import { useEnabledExtensions } from '~hooks';

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
  Objected = 'Objected',
  Motion = 'Motion', // @TODO: This was used by the old MotionTag component and should be removed
  Failed = 'Failed',
  Finalizable = 'Finalizable',
  Passed = 'Passed',
  FailedNotFinalizable = 'FailedNotFinalizable',
  Invalid = 'Invalid',
  Escalated = 'Escalated',
  Forced = 'Forced',
  Draft = 'Draft',
}

export const getMotionDatabaseId = (
  chainId: number,
  votingRepExtnAddress: string,
  nativeMotionId: BigNumber,
): string => `${chainId}-${votingRepExtnAddress}_${nativeMotionId}`;

export const getMotionState = (
  motionState: NetworkMotionState,
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
    case NetworkMotionState.Staking: {
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
    // @TODO: Confirm the logic for Finalizable and Finalized
    case NetworkMotionState.Finalizable: {
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
          return MotionState.Finalizable;
        }

        if (
          BigNumber.from(yayVotes).isZero() &&
          BigNumber.from(nayVotes).isZero()
        ) {
          /*
           * If the motion is finalizable, and we have voted, and the revealed votes haven't yet been populated to the db,
           * we shouldn't display a passed/failed tag as we don't yet know the vote outcome.
           * Instead, we show the previous stage's tag, until the vote outcome is updated in the db.
           */
          return MotionState.Reveal;
        }

        return MotionState.Failed;
      }

      if (BigNumber.from(yayStakes).eq(requiredStake)) {
        return MotionState.Finalizable;
      }
      return MotionState.Failed;
    }
    case NetworkMotionState.Finalized:
      return MotionState.Passed;
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

// export const getUpdatedDecodedMotionRoles = (
//   recipient: User,
//   fromDomain: number,
//   currentRoles: ColonyRoles = [],
//   setRoles: ActionUserRoles[],
// ) => {
//   const currentUserRoles = getRolesForUserAndDomain(
//     currentRoles,
//     recipient.walletAddress,
//     fromDomain,
//   );
//   const updatedRoles = setRoles.filter((role) => {
//     const foundCurrentRole = currentUserRoles.find(
//       (currentRole) => currentRole === role.id,
//     );
//     if (!isNil(foundCurrentRole)) {
//       return !role.setTo;
//     }
//     return role.setTo;
//   });

//   return updatedRoles;
// };

export const useShouldDisplayMotionCountdownTime = (
  motionState: MotionState | null,
) => {
  const { isVotingReputationEnabled } = useEnabledExtensions();
  return (
    isVotingReputationEnabled &&
    !!motionState &&
    motionState !== MotionState.Passed &&
    motionState !== MotionState.Failed &&
    motionState !== MotionState.FailedNotFinalizable &&
    motionState !== MotionState.Invalid
  );
};
