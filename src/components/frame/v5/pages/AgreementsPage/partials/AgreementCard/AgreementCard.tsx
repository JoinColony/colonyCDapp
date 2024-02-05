import { FilePlus, ShareNetwork } from '@phosphor-icons/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { type FC, useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { useMobile } from '~hooks/index.ts';
import useUserByNameOrAddress from '~hooks/useUserByNameOrAddress.ts';
import {
  COLONY_AGREEMENTS_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import { useGetColonyAction } from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/MotionCountDownTimer.tsx';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge/MotionStateBadge.tsx';
import TeamBadge from '~v5/common/Pills/TeamBadge/TeamBadge.tsx';
import Avatar from '~v5/shared/Avatar/Avatar.tsx';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import AgreementCardSkeleton from '../AgreementCardSkeleton.tsx';

import { type AgreementCardProps } from './types.ts';

const AgreementCard: FC<AgreementCardProps> = ({ transactionId }) => {
  const isMobile = useMobile();
  const {
    action,
    refetchMotionState,
    loadingAction,
    networkMotionState,
    motionState,
    startPollingForAction,
    stopPollingForAction,
  } = useGetColonyAction(transactionId);
  const { decisionData, motionData } = action || {};
  const {
    createdAt = '',
    description = '',
    title,
    motionDomainId,
    walletAddress = '',
  } = decisionData || {};
  const { motionId = '', motionStakes } = motionData || {};
  const navigate = useNavigate();
  const { colony } = useColonyContext();
  const { user, loading } = useUserByNameOrAddress(walletAddress);
  const currentTeam = colony?.domains?.items.find(
    (domain) => domain?.nativeId === motionDomainId,
  );

  useEffect(() => {
    startPollingForAction(getSafePollingInterval());
    return () => stopPollingForAction();
  }, [networkMotionState, startPollingForAction, stopPollingForAction]);

  const isMotionActive =
    motionStakes &&
    networkMotionState &&
    motionData &&
    motionState &&
    motionState !== MotionState.FailedNotFinalizable &&
    motionState !== MotionState.Passed;

  return (
    <div className="w-full h-full flex flex-col pt-6 pb-5 px-5 rounded-lg border border-gray-200">
      {loadingAction ? (
        <AgreementCardSkeleton />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            {motionState && <MotionStateBadge state={motionState} />}
            {isMotionActive && (
              <MotionCountDownTimer
                prefix={formatText({ id: 'agreementsPage.endsIn' })}
                className="text-negative-400 text-4"
                timerClassName="text-negative-400"
                motionState={motionState}
                motionId={motionId}
                motionStakes={motionStakes}
                refetchMotionState={refetchMotionState}
              />
            )}
          </div>
          <h5 className="text-1 mb-2 truncate">{title}</h5>
          <p className="text-sm text-gray-600 mb-4 line-clamp-4">
            {description}
          </p>
          <div className="flex items-center justify-between gap-2 pt-4 mt-auto border-t border-gray-200">
            <UserPopover
              user={user}
              walletAddress={walletAddress}
              withVerifiedBadge={false}
              className={clsx(
                'flex items-center sm:gap-2 text-gray-600 sm:hover:text-blue-400',
                {
                  'pointer-events-none': loading,
                },
              )}
            >
              <Avatar
                seed={walletAddress?.toLowerCase()}
                title={user?.profile?.displayName || walletAddress}
                avatar={user?.profile?.thumbnail || user?.profile?.avatar}
                size="sm"
                className={clsx({
                  'skeleton before:rounded-full': loading,
                })}
              />
              <p
                className={clsx('text-sm hidden sm:inline-block', {
                  skeleton: loading,
                })}
              >
                {loading
                  ? 'Loading...'
                  : formatText(
                      { id: 'agreementsPage.createdBy' },
                      {
                        username: user?.profile?.displayName || walletAddress,
                      },
                    )}
              </p>
            </UserPopover>
            <div className="flex items-center gap-2">
              {currentTeam && (
                <TeamBadge
                  name={currentTeam.metadata?.name || ''}
                  color={currentTeam.metadata?.color}
                />
              )}
              <p className="text-sm text-gray-600">
                {format(new Date(createdAt), 'd MMMM yyyy')}
              </p>
              <MeatBallMenu
                withVerticalIcon
                contentWrapperClassName={clsx('sm:min-w-[17.375rem]', {
                  '!left-6 right-6': isMobile,
                })}
                dropdownPlacementProps={{
                  withAutoTopPlacement: true,
                  top: 12,
                }}
                items={[
                  {
                    key: '1',
                    label: formatText({ id: 'activityFeedTable.menu.view' }),
                    icon: FilePlus,
                    onClick: () => {
                      navigate(
                        `${window.location.pathname}?${TX_SEARCH_PARAM}=${transactionId}`,
                        {
                          replace: true,
                        },
                      );
                    },
                  },
                  {
                    key: '2',
                    label: formatText({ id: 'activityFeedTable.menu.share' }),
                    renderItemWrapper: (props, children) => (
                      <MeatballMenuCopyItem
                        textToCopy={`${window.location.origin}/${generatePath(
                          COLONY_HOME_ROUTE,
                          { colonyName: colony.name },
                        )}${COLONY_AGREEMENTS_ROUTE}?${TX_SEARCH_PARAM}=${transactionId}`}
                        {...props}
                      >
                        {children}
                      </MeatballMenuCopyItem>
                    ),
                    icon: ShareNetwork,
                    onClick: () => false,
                  },
                ]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AgreementCard;
