import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import clsx from 'clsx';

import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { type ButtonRadioButtonItem } from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/types.ts';

export const supportOption = {
  label: formatText({ id: 'motion.support' }),
  id: 'support',
  value: MotionVote.Yay,
  className: (checked, disabled) =>
    clsx({
      'border-purple-200 text-gray-900 [&_.icon]:text-purple-400':
        !checked && !disabled,
      'border-gray-300 text-gray-300 [&_.icon]:text-gray-300': disabled,
      'border-purple-400 bg-purple-400 text-base-white': checked && !disabled,
    }),
  icon: ThumbsUp,
};

export const opposeOption = {
  label: formatText({ id: 'motion.oppose' }),
  id: 'oppose',
  value: MotionVote.Nay,
  className: (checked, disabled) =>
    clsx({
      'border-negative-300 text-gray-900 [&_.icon]:text-negative-400':
        !checked && !disabled,
      'border-gray-300 text-gray-300 [&_.icon]:text-gray-300': disabled,
      'border-negative-400 bg-negative-400 text-base-white':
        checked && !disabled,
    }),
  icon: ThumbsDown,
};

export const STAKING_RADIO_BUTTONS: ButtonRadioButtonItem<MotionVote>[] = [
  opposeOption,
  supportOption,
];
