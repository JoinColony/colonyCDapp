import clsx from 'clsx';
import React, { FC } from 'react';

import { getActionTitleValues } from '~common/ColonyActions/helpers';
import { ADDRESS_ZERO } from '~constants';
import { useColonyContext, useShouldDisplayMotionCountdownTime } from '~hooks';
import { formatText } from '~utils/intl';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer';
import Avatar from '~v5/shared/Avatar';

import { ActionDescriptionProps } from './types';

const ActionDescription: FC<ActionDescriptionProps> = ({
  action,
  loading,
  refetchMotionStates,
}) => {
  const {
    initiatorUser: user,
    initiatorAddress,
    metadata,
    isMotion,
    motionData,
    motionState,
  } = action;
  const walletAddress = user?.walletAddress || initiatorAddress || ADDRESS_ZERO;
  const refetchMotionState = () => {
    if (!motionData) {
      return;
    }

    refetchMotionStates([motionData.motionId]);
  };

  const { colony } = useColonyContext();
  const shouldShowCounter = useShouldDisplayMotionCountdownTime(
    motionState || null,
  );

  const actionMetadataDescription = colony
    ? formatText({ id: 'action.title' }, getActionTitleValues(action, colony))
    : '';

  return (
    <div className="flex gap-4 items-center w-full">
      <Avatar
        className={clsx('flex-shrink-0 flex-grow-0', {
          'overflow-hidden rounded-full skeleton': loading,
        })}
        size="xsm"
        seed={walletAddress.toLowerCase()}
        title={user?.profile?.displayName || walletAddress}
        avatar={user?.profile?.thumbnail || user?.profile?.avatar}
      />

      <div className="flex-grow flex-col-reverse md:flex-row flex md:justify-between md:items-center gap-0.5 md:gap-4">
        <div>
          <p
            className={clsx(
              'font-medium text-md text-gray-900 line-clamp-2 md:line-clamp-1 break-all',
              {
                skeleton: loading,
              },
            )}
          >
            {metadata?.customTitle || actionMetadataDescription || '-'}
          </p>
          {colony && (
            <p
              className={clsx(
                'font-normal mt-0.5 text-sm text-gray-600 line-clamp-2 md:line-clamp-1 break-all',
                {
                  skeleton: loading,
                },
              )}
            >
              {loading ? ''.padEnd(40, '-') : actionMetadataDescription}
            </p>
          )}
        </div>
        {shouldShowCounter && isMotion && motionData && motionState && (
          <MotionCountDownTimer
            className="text-negative-400 font-medium text-xs flex-shrink-0"
            timerClassName="text-negative-400 font-medium text-xs"
            prefix={formatText({
              id: 'activityFeedTable.table.motionCountDown.prefix',
            })}
            motionId={motionData.motionId}
            motionStakes={motionData.motionStakes}
            motionState={motionState}
            refetchMotionState={refetchMotionState}
          />
        )}
      </div>
    </div>
  );
};

export default ActionDescription;
