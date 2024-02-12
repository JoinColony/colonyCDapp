import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react';

import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { type ButtonRadioButtonItem } from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/types.ts';

export const supportOption = {
  label: formatText({ id: 'motion.support' }),
  id: 'support',
  value: MotionVote.Yay,
  className: 'text-gray-900 hover:text-negative-400 border-negative-400',
  checkedClassName: 'text-base-white bg-negative-400',
  iconClassName: 'text-negative-400',
  checkedIconClassName: 'text-base-white',
  icon: ThumbsUp,
};

export const opposeOption = {
  label: formatText({ id: 'motion.oppose' }),
  id: 'oppose',
  value: MotionVote.Nay,
  className: 'text-gray-900 hover:text-purple-400 border-purple-400',
  checkedClassName: 'text-base-white bg-purple-400',
  iconClassName: 'text-purple-400',
  checkedIconClassName: 'text-base-white',
  icon: ThumbsDown,
};

export const STAKING_RADIO_BUTTONS: ButtonRadioButtonItem<MotionVote>[] = [
  opposeOption,
  supportOption,
];
