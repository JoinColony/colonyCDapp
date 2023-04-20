import { defineMessages, MessageDescriptor } from 'react-intl';
import { TagColorSchema, TagTheme } from '~shared/Tag';

export enum ColonyMotions {
  /*
    I dont like Motion postfitx, but if we would use actionType for
    both motions and actions we need to have something distinct
  */
  MintTokensMotion = 'MintTokensMotion',
  PaymentMotion = 'PaymentMotion',
  UnlockTokenMotion = 'UnlockTokenMotion',
  CreateDomainMotion = 'CreateDomainMotion',
  EditDomainMotion = 'EditDomainMotion',
  ColonyEditMotion = 'ColonyEditMotion',
  SetUserRolesMotion = 'SetUserRolesMotion',
  MoveFundsMotion = 'MoveFundsMotion',
  VersionUpgradeMotion = 'VersionUpgradeMotion',
  EmitDomainReputationPenaltyMotion = 'EmitDomainReputationPenaltyMotion',
  EmitDomainReputationRewardMotion = 'EmitDomainReputationRewardMotion',
  CreateDecisionMotion = 'CreateDecisionMotion',
  NullMotion = 'NullMotion',
}

export const motionNameMapping = {
  mintTokens: ColonyMotions.MintTokensMotion,
  makePaymentFundedFromDomain: ColonyMotions.PaymentMotion,
  unlockToken: ColonyMotions.UnlockTokenMotion,
  addDomain: ColonyMotions.CreateDomainMotion,
  editDomain: ColonyMotions.EditDomainMotion,
  editColony: ColonyMotions.ColonyEditMotion,
  setUserRoles: ColonyMotions.SetUserRolesMotion,
  moveFundsBetweenPots: ColonyMotions.MoveFundsMotion,
  upgrade: ColonyMotions.VersionUpgradeMotion,
  emitDomainReputationPenalty: ColonyMotions.EmitDomainReputationPenaltyMotion,
  emitDomainReputationReward: ColonyMotions.EmitDomainReputationRewardMotion,
};

export const noMotionsVotingReputationVersion = 4;

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

const MSG = defineMessages({
  stakedTag: {
    id: 'dashboard.ActionsPage.stakedTag',
    defaultMessage: 'Staked',
  },
  stakingTag: {
    id: 'dashboard.ActionsPage.stakingTag',
    defaultMessage: 'Staking',
  },
  votingTag: {
    id: 'dashboard.ActionsPage.votingTag',
    defaultMessage: 'Voting',
  },
  revealTag: {
    id: 'dashboard.ActionsPage.revealTag',
    defaultMessage: 'Reveal',
  },
  objectionTag: {
    id: 'dashboard.ActionsPage.objectionTag',
    defaultMessage: 'Objection',
  },
  motionTag: {
    id: 'dashboard.ActionsPage.motionTag',
    defaultMessage: 'Motion',
  },
  failedTag: {
    id: 'dashboard.ActionsPage.failedTag',
    defaultMessage: 'Failed',
  },
  passedTag: {
    id: 'dashboard.ActionsPage.passedTag',
    defaultMessage: 'Passed',
  },
  invalidTag: {
    id: 'dashboard.ActionsPage.invalidTag',
    defaultMessage: 'Invalid',
  },
  escalateTag: {
    id: 'dashboard.ActionsPage.escalateTag',
    defaultMessage: 'Escalate',
  },
  forcedTag: {
    id: 'dashboard.ActionsPage.forcedTag',
    defaultMessage: 'Forced',
  },
});

export interface MotionStyles {
  theme: TagTheme;
  colorSchema: TagColorSchema;
  name: MessageDescriptor;
  tagName: string;
}

export const MOTION_TAG_MAP = {
  [MotionState.Staked]: {
    theme: TagTheme.Primary,
    colorSchema: TagColorSchema.FullColor,
    name: MSG.stakedTag,
    tagName: 'motionTag',
  },
  [MotionState.Staking]: {
    theme: TagTheme.Pink,
    colorSchema: TagColorSchema.Inverted,
    name: MSG.stakingTag,
    tagName: 'stakingTag',
  },
  [MotionState.Voting]: {
    theme: TagTheme.Golden,
    colorSchema: TagColorSchema.FullColor,
    name: MSG.votingTag,
    tagName: 'votingTag',
  },
  [MotionState.Reveal]: {
    theme: TagTheme.Blue,
    colorSchema: TagColorSchema.FullColor,
    name: MSG.revealTag,
    tagName: 'revealTag',
  },
  [MotionState.Objection]: {
    theme: TagTheme.Pink,
    colorSchema: TagColorSchema.FullColor,
    name: MSG.objectionTag,
    tagName: 'objectionTag',
  },
  [MotionState.Motion]: {
    theme: TagTheme.Primary,
    colorSchema: TagColorSchema.FullColor,
    name: MSG.motionTag,
    tagName: 'motionTag',
  },
  [MotionState.Failed]: {
    theme: TagTheme.Pink,
    colorSchema: TagColorSchema.Plain,
    name: MSG.failedTag,
    tagName: 'failedTag',
  },
  [MotionState.FailedNoFinalizable]: {
    theme: TagTheme.Pink,
    colorSchema: TagColorSchema.Plain,
    name: MSG.failedTag,
    tagName: 'failedTag',
  },
  [MotionState.Passed]: {
    theme: TagTheme.Primary,
    colorSchema: TagColorSchema.Plain,
    name: MSG.passedTag,
    tagName: 'passedTag',
  },
  [MotionState.Invalid]: {
    theme: TagTheme.Pink,
    colorSchema: TagColorSchema.Plain,
    name: MSG.invalidTag,
    tagName: 'invalidTag',
  },
  [MotionState.Escalation]: {
    theme: TagTheme.DangerGhost,
    colorSchema: TagColorSchema.Plain,
    name: MSG.escalateTag,
    tagName: 'escalateTag',
  },
  [MotionState.Forced]: {
    theme: TagTheme.Blue,
    colorSchema: TagColorSchema.Inverted,
    name: MSG.forcedTag,
    tagName: 'forcedTag',
  },
};

export interface MotionValue {
  motionId: number;
}
