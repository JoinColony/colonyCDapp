import clsx from 'clsx';
import React, { type FC } from 'react';

import useGetActionTitleValues from '~common/ColonyActions/helpers/getActionTitleValues.ts';
import { ADDRESS_ZERO } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import useShouldDisplayMotionCountdownTime from '~hooks/useShouldDisplayMotionCountdownTime.ts';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import { formatText } from '~utils/intl.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/index.ts';
import { UserAvatar } from '~v5/shared/UserAvatar/UserAvatar.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import { type ActionDescriptionProps } from './types.ts';

const ActionDescription: FC<ActionDescriptionProps> = ({
  action,
  loading,
  refetchMotionStates,
  hideDetails,
  showUserAvatar = true,
}) => {
  const isMobile = useMobile();
  const {
    initiatorUser: user,
    initiatorAddress,
    metadata,
    decisionData,
    isMotion,
    motionData,
    motionState,
    expenditureId,
    recipientAddress,
  } = action;

  const { user: recipientUser, loading: loadingUser } = useUserByAddress(
    recipientAddress || '',
    true,
  );

  const { expenditure, loadingExpenditure } =
    useGetExpenditureData(expenditureId);

  const isLoading = loading || loadingExpenditure || loadingUser;

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

  const { networkInverseFee } = useNetworkInverseFee();

  // @todo: add streaming payment data
  const actionMetadataDescription = formatText(
    { id: 'action.title' },
    useGetActionTitleValues({
      actionData: {
        ...action,
        recipientAddress: recipientUser?.walletAddress ?? recipientAddress,
        recipientUser: recipientUser ?? action.recipientUser,
      },
      colony,
      expenditureData: expenditure ?? undefined,
      networkInverseFee,
    }),
  );

  return (
    <div className="flex w-full items-center gap-2 sm:gap-4">
      {showUserAvatar && (
        <>
          {loading ? (
            <div className="aspect-square h-[26px] w-auto rounded-full skeleton before:rounded-full" />
          ) : (
            <UserInfoPopover
              walletAddress={walletAddress}
              user={user}
              popperOptions={{
                placement: 'bottom-start',
              }}
              withVerifiedBadge={false}
            >
              <UserAvatar
                size={26}
                userAddress={walletAddress}
                userName={user?.profile?.displayName ?? undefined}
                userAvatarSrc={
                  user?.profile?.thumbnail ?? user?.profile?.avatar ?? undefined
                }
                className="flex-shrink-0 flex-grow-0"
              />
            </UserInfoPopover>
          )}
        </>
      )}
      <div className="flex min-w-0 flex-grow flex-col-reverse gap-0.5 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex w-full min-w-0 flex-col">
          <p
            className={clsx(
              'line-clamp-2 min-w-0 break-words text-md font-medium text-gray-900 md:line-clamp-1',
              {
                'overflow-hidden rounded skeleton sm:w-64': isLoading,
              },
            )}
          >
            {metadata?.customTitle ||
              decisionData?.title ||
              actionMetadataDescription ||
              '-'}
          </p>
          {colony && (
            <p
              className={clsx(
                'mt-0.5 line-clamp-2 text-sm font-normal text-gray-600 md:line-clamp-1',
                {
                  'overflow-hidden rounded skeleton sm:w-48': isLoading,
                  hidden: hideDetails,
                },
              )}
            >
              {isLoading ? '-' : actionMetadataDescription}
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
                'flex-shrink-0 text-xs font-medium text-negative-400',
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
