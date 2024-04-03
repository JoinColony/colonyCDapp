import clsx from 'clsx';
import React, { type FC } from 'react';

import { useUserAvatars } from '~hooks/useUserAvatars.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import ProgressBar from '~v5/shared/ProgressBar/index.ts';
import UserAvatars from '~v5/shared/UserAvatars/index.ts';

import { type VoteStatusesProps } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.Motion.steps.OutcomeStep.partials.VoteStatuses';

const VoteStatuses: FC<VoteStatusesProps> = ({ items, voters }) => {
  const {
    registeredUsers: yayVoters,
    remainingAvatarsCount: remainingYayVoters,
  } = useUserAvatars(
    3,
    voters.filter(({ vote }) => vote === MotionVote.Yay),
  );
  const {
    registeredUsers: nayVoters,
    remainingAvatarsCount: remainingNayVoters,
  } = useUserAvatars(
    3,
    voters.filter(({ vote }) => vote === MotionVote.Nay),
  );

  return (
    <div className="grid grid-cols-[1fr_auto] gap-8">
      {items.map(({ key, icon: Icon, label, progress, status }) => (
        <React.Fragment key={key}>
          <div className="flex w-full grow flex-col gap-1">
            <span className="flex items-start gap-[0.375rem]">
              <Icon
                className={clsx('h-[1em] w-[1em] text-[1.125rem]', {
                  'text-purple-400': status === MotionVote.Yay,
                  'text-negative-400': status === MotionVote.Nay,
                })}
                size={20}
              />
              <span
                className={clsx('text-3', {
                  'text-purple-400': status === MotionVote.Yay,
                  'text-negative-400': status === MotionVote.Nay,
                })}
              >
                {label}
              </span>
            </span>
            <ProgressBar
              progress={progress}
              progressLabel={`${progress}%`}
              max={100}
              barClassName={clsx({
                'bg-purple-200': status === MotionVote.Yay,
                'bg-negative-300': status === MotionVote.Nay,
              })}
            />
          </div>
          {!!voters.length && (
            <UserAvatars
              className="relative top-[3px] flex shrink"
              items={status === MotionVote.Yay ? yayVoters : nayVoters}
              remainingAvatarsCount={
                status === MotionVote.Yay
                  ? remainingYayVoters
                  : remainingNayVoters
              }
              maxAvatarsToShow={3}
              size={26}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

VoteStatuses.displayName = displayName;

export default VoteStatuses;
