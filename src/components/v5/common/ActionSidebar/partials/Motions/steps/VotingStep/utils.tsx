import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import clsx from 'clsx';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';

export const useRenderVoteRadioButtons = (
  hasUserVoted: boolean,
  userVote: number,
) => {
  const { isDarkMode } = usePageThemeContext();
  const supportOption = {
    label: formatText({ id: 'motion.support' }),
    id: 'support',
    value: MotionVote.Yay,
    className: (checked, disabled) =>
      clsx({
        'border-purple-200 text-gray-900 [&_.icon]:text-purple-400':
          !checked && !disabled,
        'border-gray-300 text-gray-300 [&_.icon]:text-gray-300': disabled,
        'border-purple-400 bg-purple-400 text-base-white':
          checked && !disabled && !isDarkMode,
        'border-purple-400 bg-purple-400 text-gray-900':
          checked && !disabled && isDarkMode,
      }),
    icon: ThumbsUp,
  };
  const opposeOption = {
    label: formatText({ id: 'motion.oppose' }),
    id: 'oppose',
    value: MotionVote.Nay,
    className: (checked, disabled) =>
      clsx({
        'border-negative-300 text-gray-900 [&_.icon]:text-negative-400':
          !checked && !disabled,
        'border-gray-300 text-gray-300 [&_.icon]:text-gray-300': disabled,
        'border-negative-400 bg-negative-400 text-base-white':
          checked && !disabled && !isDarkMode,
        'border-negative-400 bg-negative-400 text-gray-900':
          checked && !disabled && isDarkMode,
      }),
    icon: ThumbsDown,
  };

  if (!hasUserVoted) {
    return [opposeOption, supportOption];
  }

  if (userVote === MotionVote.Nay) {
    return [supportOption];
  }

  return [opposeOption];
};

export const setLocalStorageVoteValue = (transactionId: string, vote: number) =>
  localStorage.setItem(`${transactionId}-vote`, `${vote}`);

export const getLocalStorageVoteValue = (transactionId: string) =>
  JSON.parse(localStorage.getItem(`${transactionId}-vote`) || 'null');
