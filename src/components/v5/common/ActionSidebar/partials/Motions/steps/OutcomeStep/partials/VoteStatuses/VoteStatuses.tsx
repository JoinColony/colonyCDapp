import React, { FC } from 'react';
import clsx from 'clsx';
import ProgressBar from '~v5/shared/ProgressBar';
import UserAvatars from '~v5/shared/UserAvatars';
import Icon from '~shared/Icon';
import { VoteStatusesProps } from './types';
import { MotionVote } from '~utils/colonyMotions';
import { useUserAvatars } from '~hooks/useUserAvatars';

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
    <>
      {items.map(({ key, iconName, label, progress, status }) => (
        <div key={key} className="flex items-center w-full gap-8">
          <div className="flex grow flex-col gap-1">
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
              className="flex shrink"
              items={status === MotionVote.Yay ? yayVoters : nayVoters}
              remainingAvatarsCount={
                status === MotionVote.Yay
                  ? remainingYayVoters
                  : remainingNayVoters
              }
              maxAvatarsToShow={3}
            />
          )}
        </div>
      ))}
    </>
  );
};

VoteStatuses.displayName = displayName;

export default VoteStatuses;
