import { BigNumber } from 'ethers';
import { Decimal } from 'decimal.js';
import {
  ColonyRoles,
  MotionState as NetworkMotionState,
} from '@colony/colony-js';

import { isNil } from '~utils/lodash';
import { getRolesForUserAndDomain } from '~redux/transformers';
import { ActionUserRoles, MotionData, User } from '~types';

export enum MotionVote {
  Yay = 1,
  Nay = 0,
}

export enum MotionState {
  Staked = 'Staked',
  Staking = 'Staking',
  Voting = 'Voting',
  Reveal = 'Reveal',
  Objection = 'Objection',
  Motion = 'Motion',
  Failed = 'Failed',
  Passed = 'Passed',
  FailedNotFinalizable = 'FailedNotFinalizable',
  Invalid = 'Invalid',
  Escalation = 'Escalation',
  Forced = 'Forced',
}

export const getMotionState = (
  {
    motionState,
    motionStakes: {
      raw: { yay: yayStakes, nay: nayStakes },
    },
  }: MotionData,
  requiredStake: string,
) => {
  switch (motionState) {
    case NetworkMotionState.Staking: {
      return BigNumber.from(yayStakes).gte(requiredStake) &&
        BigNumber.from(nayStakes).isZero()
        ? MotionState.Staked
        : MotionState.Staking;
    }
    case NetworkMotionState.Submit: {
      return MotionState.Voting;
    }
    case NetworkMotionState.Reveal: {
      return MotionState.Reveal;
    }
    case NetworkMotionState.Closed: {
      return MotionState.Escalation;
    }
    case NetworkMotionState.Finalizable:
    case NetworkMotionState.Finalized: {
      /* @TODO: Add when voting gets wired in.
        if (nayStakes.gte(requiredStakes) && yayStakes.gte(requiredStakes)) {
        const [nayVotes, yayVotes] = motion.votes;
        
         * It only passes if the yay votes outnumber the nay votes
         * If the votes are equal, it fails
         
        if (yayVotes.gt(nayVotes)) {
          return MotionState.Passed;
        }
        return MotionState.Failed;
      }
      */
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

export const getUpdatedDecodedMotionRoles = (
  recipient: User,
  fromDomain: number,
  currentRoles: ColonyRoles = [],
  setRoles: ActionUserRoles[],
) => {
  const currentUserRoles = getRolesForUserAndDomain(
    currentRoles,
    recipient.walletAddress,
    fromDomain,
  );
  const updatedRoles = setRoles.filter((role) => {
    const foundCurrentRole = currentUserRoles.find(
      (currentRole) => currentRole === role.id,
    );
    if (!isNil(foundCurrentRole)) {
      return !role.setTo;
    }
    return role.setTo;
  });

  return updatedRoles;
};
