import { BigNumber } from 'ethers';
import { Decimal } from 'decimal.js';
import { isNil } from 'lodash';
import { ColonyRoles } from '@colony/colony-js';

import { getRolesForUserAndDomain } from '~redux/transformers';
import { AnyUser } from '~data/index';
import { ActionUserRoles } from '~types';

import { intl } from './intl';

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
  Draft = 'Draft',
}
export enum MotionVote {
  Yay = 1,
  Nay = 0,
}

const { formatMessage } = intl({
  'tag.staked': 'Staked',
  'tag.staking': 'Staking',
  'tag.voting': 'Voting',
  'tag.reveal': 'Reveal',
  'tag.objection': 'Objection',
  'tag.motion': 'Motion',
  'tag.failed': 'Failed',
  'tag.passed': 'Passed',
  'tag.invalid': 'Invalid',
  'tag.escalate': 'Escalate',
  'tag.forced': 'Forced',
  'tag.draft': 'Draft',
});

export const MOTION_TAG_MAP = {
  [MotionState.Staked]: {
    theme: 'primary',
    colorSchema: 'fullColor',
    name: formatMessage({ id: 'tag.staked' }),
    tagName: 'motionTag',
  },
  [MotionState.Staking]: {
    theme: 'pink',
    colorSchema: 'inverted',
    name: formatMessage({ id: 'tag.staking' }),
    tagName: 'stakingTag',
  },
  [MotionState.Voting]: {
    theme: 'golden',
    colorSchema: 'fullColor',
    name: formatMessage({ id: 'tag.voting' }),
    tagName: 'votingTag',
  },
  [MotionState.Reveal]: {
    theme: 'blue',
    colorSchema: 'fullColor',
    name: formatMessage({ id: 'tag.reveal' }),
    tagName: 'revealTag',
  },
  [MotionState.Objection]: {
    theme: 'pink',
    colorSchema: 'fullColor',
    name: formatMessage({ id: 'tag.objection' }),
    tagName: 'objectionTag',
  },
  [MotionState.Motion]: {
    theme: 'primary',
    colorSchema: 'fullColor',
    name: formatMessage({ id: 'tag.motion' }),
    tagName: 'motionTag',
  },
  [MotionState.Failed]: {
    theme: 'pink',
    colorSchema: 'plain',
    name: formatMessage({ id: 'tag.failed' }),
    tagName: 'failedTag',
  },
  [MotionState.FailedNoFinalizable]: {
    theme: 'pink',
    colorSchema: 'plain',
    name: formatMessage({ id: 'tag.failed' }),
    tagName: 'failedTag',
  },
  [MotionState.Passed]: {
    theme: 'primary',
    colorSchema: 'plain',
    name: formatMessage({ id: 'tag.passed' }),
    tagName: 'passedTag',
  },
  [MotionState.Invalid]: {
    theme: 'pink',
    colorSchema: 'plain',
    name: formatMessage({ id: 'tag.invalid' }),
    tagName: 'invalidTag',
  },
  [MotionState.Escalation]: {
    theme: 'dangerGhost',
    colorSchema: 'plain',
    name: formatMessage({ id: 'tag.escalate' }),
    tagName: 'escalateTag',
  },
  [MotionState.Forced]: {
    theme: 'blue',
    colorSchema: 'inverted',
    name: formatMessage({ id: 'tag.forced' }),
    tagName: 'forcedTag',
  },
  [MotionState.Draft]: {
    theme: 'golden',
    colorSchema: 'fullColor',
    name: formatMessage({ id: 'tag.draft' }),
    tagName: 'draftTag',
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
