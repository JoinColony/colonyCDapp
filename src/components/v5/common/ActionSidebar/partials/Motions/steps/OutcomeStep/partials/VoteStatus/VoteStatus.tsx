import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import ProgressBar from '~v5/shared/ProgressBar';
import Icon from '~shared/Icon';
import { VoteStatusProps } from './types';
import { MotionVote } from '~utils/colonyMotions';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep.partials.VoteStatus';

const VoteStatus: FC<PropsWithChildren<VoteStatusProps>> = ({
  status,
  iconName,
  label,
  progress,
  children,
}) => {
  return (
    <div className="flex items-center w-full gap-8">
      <div className="flex flex-col gap-1 w-full">
        <span className="flex items-start gap-[0.375rem]">
          <Icon
            className={clsx('h-[1em] w-[1em] text-[1.125rem] ', {
              'text-purple-400': status === MotionVote.Yay,
              'text-red-400': status === MotionVote.Nay,
            })}
            name={iconName}
          />
          <span
            className={clsx('text-3 ', {
              'text-purple-400': status === MotionVote.Yay,
              'text-red-400': status === MotionVote.Nay,
            })}
          >
            {label}
          </span>
        </span>
        <ProgressBar
          progress={parseInt(progress, 2)}
          max={100}
          additionalText="%"
          className={clsx({
            'bg-purple-200': status === MotionVote.Yay,
            'bg-red-300': status === MotionVote.Nay,
          })}
        />
      </div>
      {children}
    </div>
  );
};

VoteStatus.displayName = displayName;

export default VoteStatus;
