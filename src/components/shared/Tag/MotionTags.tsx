import React, { ComponentType } from 'react';

import { MotionState } from '~utils/colonyMotions';
import { intl } from '~utils/intl';

import Tag, { TagColorSchema, TagTheme } from './Tag';

export enum TagName {
  MotionTag = 'MotionTag',
  StakedTag = 'StakedTag',
  StakingTag = 'StakingTag',
  VotingTag = 'VotingTag',
  RevealTag = 'RevealTag',
  ObjectionTag = 'ObjectionTag',
  FailedTag = 'FailedTag',
  FinalizableTag = 'FinalizableTag',
  PassedTag = 'PassedTag',
  InvalidTag = 'InvalidTag',
  EscalateTag = 'EscalateTag',
  ForcedTag = 'ForcedTag',
  DraftTag = 'DraftTag',
}

enum TagText {
  Staked = 'Supported',
  Staking = 'Staking',
  Voting = 'Voting',
  Reveal = 'Reveal',
  Objection = 'Objected',
  Motion = 'Motion',
  Failed = 'Failed',
  Finalizable = 'Finalizable',
  Passed = 'Passed',
  Invalid = 'Invalid',
  Escalate = 'Escalated',
  Forced = 'Forced',
  Draft = 'Draft',
}

const { formatMessage } = intl({
  [TagName.StakedTag]: TagText.Staked,
  [TagName.StakingTag]: TagText.Staking,
  [TagName.VotingTag]: TagText.Voting,
  [TagName.RevealTag]: TagText.Reveal,
  [TagName.ObjectionTag]: TagText.Objection,
  [TagName.MotionTag]: TagText.Motion,
  [TagName.FailedTag]: TagText.Failed,
  [TagName.FinalizableTag]: TagText.Finalizable,
  [TagName.PassedTag]: TagText.Passed,
  [TagName.InvalidTag]: TagText.Invalid,
  [TagName.EscalateTag]: TagText.Escalate,
  [TagName.ForcedTag]: TagText.Forced,
  [TagName.DraftTag]: TagText.Draft,
});

export interface MotionStyles {
  theme: TagTheme;
  colorSchema: TagColorSchema;
  text: TagText;
  tagName: TagName;
}

export const MOTION_TAG_MAP: {
  [key in keyof typeof MotionState]: MotionStyles;
} = {
  [MotionState.Supported]: {
    theme: TagTheme.Primary,
    colorSchema: TagColorSchema.FullColor,
    text: formatMessage({ id: TagName.StakedTag }) as TagText,
    tagName: TagName.MotionTag,
  },
  [MotionState.Staking]: {
    theme: TagTheme.Pink,
    colorSchema: TagColorSchema.Inverted,
    text: formatMessage({ id: TagName.StakingTag }) as TagText,
    tagName: TagName.StakingTag,
  },
  [MotionState.Voting]: {
    theme: TagTheme.Golden,
    colorSchema: TagColorSchema.FullColor,
    text: formatMessage({ id: TagName.VotingTag }) as TagText,
    tagName: TagName.VotingTag,
  },
  [MotionState.Reveal]: {
    theme: TagTheme.Blue,
    colorSchema: TagColorSchema.FullColor,
    text: formatMessage({ id: TagName.RevealTag }) as TagText,
    tagName: TagName.RevealTag,
  },
  [MotionState.Objected]: {
    theme: TagTheme.Pink,
    colorSchema: TagColorSchema.FullColor,
    text: formatMessage({ id: TagName.ObjectionTag }) as TagText,
    tagName: TagName.ObjectionTag,
  },
  [MotionState.Motion]: {
    theme: TagTheme.Primary,
    colorSchema: TagColorSchema.FullColor,
    text: formatMessage({ id: TagName.MotionTag }) as TagText,
    tagName: TagName.MotionTag,
  },
  [MotionState.Failed]: {
    theme: TagTheme.Pink,
    colorSchema: TagColorSchema.Plain,
    text: formatMessage({ id: TagName.FailedTag }) as TagText,
    tagName: TagName.FailedTag,
  },
  [MotionState.FailedNotFinalizable]: {
    theme: TagTheme.Pink,
    colorSchema: TagColorSchema.Plain,
    text: formatMessage({ id: TagName.FailedTag }) as TagText,
    tagName: TagName.FailedTag,
  },
  [MotionState.Finalizable]: {
    theme: TagTheme.Primary,
    colorSchema: TagColorSchema.Plain,
    text: formatMessage({ id: TagName.PassedTag }) as TagText,
    tagName: TagName.PassedTag,
  },
  [MotionState.Passed]: {
    theme: TagTheme.Primary,
    colorSchema: TagColorSchema.Plain,
    text: formatMessage({ id: TagName.PassedTag }) as TagText,
    tagName: TagName.PassedTag,
  },
  [MotionState.Invalid]: {
    theme: TagTheme.Pink,
    colorSchema: TagColorSchema.Plain,
    text: formatMessage({ id: TagName.InvalidTag }) as TagText,
    tagName: TagName.InvalidTag,
  },
  [MotionState.Escalated]: {
    theme: TagTheme.DangerGhost,
    colorSchema: TagColorSchema.Plain,
    text: formatMessage({ id: TagName.EscalateTag }) as TagText,
    tagName: TagName.EscalateTag,
  },
  [MotionState.Forced]: {
    theme: TagTheme.Blue,
    colorSchema: TagColorSchema.Inverted,
    text: formatMessage({ id: TagName.ForcedTag }) as TagText,
    tagName: TagName.ForcedTag,
  },
  [MotionState.Draft]: {
    theme: TagTheme.Golden,
    colorSchema: TagColorSchema.FullColor,
    text: formatMessage({ id: TagName.DraftTag }) as TagText,
    tagName: TagName.DraftTag,
  },
};

type MotionTag = ComponentType;
type TagsRecord = { [key in MotionState]: MotionTag };

export const motionTags = Object.entries(MOTION_TAG_MAP).reduce<TagsRecord>(
  (acc, [motionState, { theme, colorSchema, text }]) => ({
    ...acc,
    [motionState]: () => (
      <Tag text={text} appearance={{ theme, colorSchema }} />
    ),
  }),
  {} as TagsRecord,
);

export const {
  Escalated,
  Failed,
  Forced,
  Invalid,
  Motion,
  Objected,
  Finalizable,
  Passed,
  Reveal,
  Staking,
  Voting,
  Draft,
} = motionTags;
