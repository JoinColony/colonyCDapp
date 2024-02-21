import clsx from 'clsx';
import React, { type FC } from 'react';

import { getActionTitleValues } from '~common/ColonyActions/helpers/index.ts';
import { ADDRESS_ZERO } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { useMobile } from '~hooks';
import useShouldDisplayMotionCountdownTime from '~hooks/useShouldDisplayMotionCountdownTime.ts';
import { formatText } from '~utils/intl.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/index.ts';
import Avatar from '~v5/shared/Avatar/index.ts';

import { type ActionDescriptionProps } from './types.ts';

const ActionDescription: FC<ActionDescriptionProps> = ({
  action,
  loading,
  refetchMotionStates,
  hideDetails,
}) => {
  const isMobile = useMobile();
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

  const actionMetadataDescription = formatText(
    { id: 'action.title' },
    getActionTitleValues(action, colony),
  );

  return (
    <div className="flex gap-2 sm:gap-4 items-center w-full">
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
              'font-medium text-md text-gray-900 line-clamp-2 md:line-clamp-1',
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
                'font-normal mt-0.5 text-sm text-gray-600 line-clamp-2 md:line-clamp-1',
                {
                  skeleton: loading,
                  hidden: hideDetails,
                },
              )}
            >
              {loading ? '-' : actionMetadataDescription}
            </p>
          )}
        </div>
        {shouldShowCounter &&
          isMotion &&
          motionData &&
          motionState &&
          !isMobile && (
            <MotionCountDownTimer
              className={clsx(
                'text-negative-400 font-medium text-xs flex-shrink-0',
                {
                  hidden: hideDetails,
                },
              )}
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
