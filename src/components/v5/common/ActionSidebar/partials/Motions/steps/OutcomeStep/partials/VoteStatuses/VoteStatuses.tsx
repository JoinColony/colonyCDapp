import clsx from 'clsx';
import React, { type FC } from 'react';

import { useUserAvatars } from '~hooks/useUserAvatars.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import ProgressBar from '~v5/shared/ProgressBar/index.ts';
import UserAvatars from '~v5/shared/UserAvatars/index.ts';

import { type VoteStatusesProps } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.Motion.steps.OutcomeStep.partials.VoteStatuses';

// @TODO re-check for UserAvatars after change
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
    <div className="flex flex-col gap-5">
      {items.map(({ key, icon: Icon, label, progress, status }) => (
        <div key={key} className="flex w-full items-center gap-8">
          <div className="flex max-w-[182px] grow flex-col gap-1">
            <span className="flex items-start gap-[0.375rem]">
              <Icon
                className={clsx('h-[1em] w-[1em] text-[1.125rem]', {
                  'text-purple-400': status === MotionVote.Yay,
                  'text-red-400': status === MotionVote.Nay,
                })}
                size={20}
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
              size={28}
            />
          )}
        </div>
      ))}
    </div>
  );
};

VoteStatuses.displayName = displayName;

export default VoteStatuses;
