import clsx from 'clsx';
import React, { FC } from 'react';

import { useUserAvatars } from '~hooks/useUserAvatars.ts';
import Icon from '~shared/Icon/index.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import ProgressBar from '~v5/shared/ProgressBar/index.ts';
import UserAvatars from '~v5/shared/UserAvatars/index.ts';

import { VoteStatusesProps } from './types.ts';

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
    <div className="flex flex-col gap-5">
      {items.map(({ key, iconName, label, progress, status }) => (
        <div key={key} className="flex items-center w-full gap-8">
          <div className="flex grow flex-col gap-1 max-w-[182px]">
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
          {!!voters.length && (
            <UserAvatars
              className="flex shrink relative top-[3px]"
              items={status === MotionVote.Yay ? yayVoters : nayVoters}
              remainingAvatarsCount={
                status === MotionVote.Yay
                  ? remainingYayVoters
                  : remainingNayVoters
              }
              maxAvatarsToShow={3}
              size="smx"
            />
          )}
        </div>
      ))}
    </div>
  );
};

VoteStatuses.displayName = displayName;

export default VoteStatuses;
