import { BigNumber } from 'ethers';
import { Decimal } from 'decimal.js';
import { ColonyRoles } from '@colony/colony-js';

import { isNil } from '~utils/lodash';
import { getRolesForUserAndDomain } from '~redux/transformers';
import { ActionUserRoles, User } from '~types';

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

// Todo: port full mapping logic
export const motionStateMap = {
  //0: MotionState.Null,
  1: MotionState.Staking,
  2: MotionState.Voting,
  3: MotionState.Reveal,
  4: MotionState.Escalation,
  //5: MotionState.Finalizable,
  //6: MotionState.Finalized,
  7: MotionState.Failed,
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
