import React, { FC } from 'react';
import clsx from 'clsx';
import { MotionVote } from '~utils/colonyMotions';
import MembersAvatars from '~v5/shared/MembersAvatars';
import ProgressBar from '~v5/shared/ProgressBar';
import { VoteStatusesProps } from './types';
import { useMemberAvatars } from '../../hooks';
import { Watcher } from '~types';
import Icon from '~shared/Icon';

const displayName =
  'v5.common.ActionSidebar.partials.Motion.steps.OutcomeStep.partials.VoteStatuses';

const VoteStatuses: FC<VoteStatusesProps> = ({ items }) => {
  const { watchers } = useMemberAvatars();

  return (
    <>
      {items.map(({ key, iconName, label, progress, status }) => (
        <div key={key} className="flex items-center w-full gap-8">
          <div className="flex flex-col gap-1 w-full">
            <span className="flex items-start gap-[0.375rem]">
              <Icon
                className={clsx('h-[1em] w-[1em] text-[1.125rem]', {
                  'text-purple-400': status === MotionVote.Yay,
                  'text-red-400': status === MotionVote.Nay,
                })}
                name={iconName}
              />
              <span
                className={clsx('text-3', {
                  'text-purple-400': status === MotionVote.Yay,
                  'text-red-400': status === MotionVote.Nay,
                })}
              >
                {label}
              </span>
            </span>
            <ProgressBar
              progress={progress}
              max={100}
              additionalText="%"
              barClassName={clsx({
                'bg-purple-200': status === MotionVote.Yay,
                'bg-red-300': status === MotionVote.Nay,
              })}
            />
          </div>
          <MembersAvatars<Watcher>
            className="flex items-end flex-1"
            items={watchers}
          />
        </div>
      ))}
      ;
    </>
  );
};

VoteStatuses.displayName = displayName;

export default VoteStatuses;
