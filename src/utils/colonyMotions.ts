import { defineMessage } from 'react-intl';
import { BigNumber } from 'ethers';
import { Decimal } from 'decimal.js';
import { isNil } from 'lodash';
import { ColonyRoles } from '@colony/colony-js';

import { getRolesForUserAndDomain } from '~redux/transformers';
import { AnyUser } from '~data/index';
import { ActionUserRoles } from '~types';

export enum MotionState {
  Staked = 'Staked',
  Staking = 'Staking',
  Voting = 'Voting',
  Reveal = 'Reveal',
  Objection = 'Objection',
  Motion = 'Motion',
  Failed = 'Failed',
  Passed = 'Passed',
  FailedNoFinalizable = 'FailedNoFinalizable',
  Invalid = 'Invalid',
  Escalation = 'Escalation',
  Forced = 'Forced',
}

export enum MotionVote {
  Yay = 1,
  Nay = 0,
}

const MSG = defineMessage({
  stakedTag: {
    id: 'common.ColonyHome.ActionsPage.stakedTag',
    defaultMessage: 'Staked',
  },
  stakingTag: {
    id: 'common.ColonyHome.ActionsPage.stakingTag',
    defaultMessage: 'Staking',
  },
  votingTag: {
    id: 'common.ColonyHome.ActionsPage.votingTag',
    defaultMessage: 'Voting',
  },
  revealTag: {
    id: 'common.ColonyHome.ActionsPage.revealTag',
    defaultMessage: 'Reveal',
  },
  objectionTag: {
    id: 'common.ColonyHome.ActionsPage.objectionTag',
    defaultMessage: 'Objection',
  },
  motionTag: {
    id: 'common.ColonyHome.ActionsPage.motionTag',
    defaultMessage: 'Motion',
  },
  failedTag: {
    id: 'common.ColonyHome.ActionsPage.failedTag',
    defaultMessage: 'Failed',
  },
  passedTag: {
    id: 'common.ColonyHome.ActionsPage.passedTag',
    defaultMessage: 'Passed',
  },
  invalidTag: {
    id: 'common.ColonyHome.ActionsPage.invalidTag',
    defaultMessage: 'Invalid',
  },
  escalateTag: {
    id: 'common.ColonyHome.ActionsPage.escalateTag',
    defaultMessage: 'Escalate',
  },
  forcedTag: {
    id: 'common.ColonyHome.ActionsPage.forcedTag',
    defaultMessage: 'Forced',
  },
});

export const MOTION_TAG_MAP = {
  [MotionState.Staked]: {
    theme: 'primary',
    colorSchema: 'fullColor',
    name: MSG.stakedTag,
    tagName: 'motionTag',
  },
  [MotionState.Staking]: {
    theme: 'pink',
    colorSchema: 'inverted',
    name: MSG.stakingTag,
    tagName: 'stakingTag',
  },
  [MotionState.Voting]: {
    theme: 'golden',
    colorSchema: 'fullColor',
    name: MSG.votingTag,
    tagName: 'votingTag',
  },
  [MotionState.Reveal]: {
    theme: 'blue',
    colorSchema: 'fullColor',
    name: MSG.revealTag,
    tagName: 'revealTag',
  },
  [MotionState.Objection]: {
    theme: 'pink',
    colorSchema: 'fullColor',
    name: MSG.objectionTag,
    tagName: 'objectionTag',
  },
  [MotionState.Motion]: {
    theme: 'primary',
    colorSchema: 'fullColor',
    name: MSG.motionTag,
    tagName: 'motionTag',
  },
  [MotionState.Failed]: {
    theme: 'pink',
    colorSchema: 'plain',
    name: MSG.failedTag,
    tagName: 'failedTag',
  },
  [MotionState.FailedNoFinalizable]: {
    theme: 'pink',
    colorSchema: 'plain',
    name: MSG.failedTag,
    tagName: 'failedTag',
  },
  [MotionState.Passed]: {
    theme: 'primary',
    colorSchema: 'plain',
    name: MSG.passedTag,
    tagName: 'passedTag',
  },
  [MotionState.Invalid]: {
    theme: 'pink',
    colorSchema: 'plain',
    name: MSG.invalidTag,
    tagName: 'invalidTag',
  },
  [MotionState.Escalation]: {
    theme: 'dangerGhost',
    colorSchema: 'plain',
    name: MSG.escalateTag,
    tagName: 'escalateTag',
  },
  [MotionState.Forced]: {
    theme: 'blue',
    colorSchema: 'inverted',
    name: MSG.forcedTag,
    tagName: 'forcedTag',
  },
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

export const shouldDisplayMotion = (
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
  recipient: AnyUser,
  fromDomain: number,
  currentRoles: ColonyRoles = [],
  setRoles: ActionUserRoles[],
) => {
  const currentUserRoles = getRolesForUserAndDomain(
    currentRoles,
    recipient.id,
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
