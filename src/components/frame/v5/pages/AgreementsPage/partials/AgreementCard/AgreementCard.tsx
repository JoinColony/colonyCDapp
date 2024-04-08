import { FilePlus, ShareNetwork } from '@phosphor-icons/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { type FC, useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import {
  COLONY_AGREEMENTS_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/MotionCountDownTimer.tsx';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge/MotionStateBadge.tsx';
import TeamBadge from '~v5/common/Pills/TeamBadge/TeamBadge.tsx';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';
import RichTextDisplay from '~v5/shared/RichTextDisplay/index.ts';
import { UserAvatar2 } from '~v5/shared/UserAvatar/UserAvatar.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

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
    createdAt,
    description,
    title,
    motionDomainId,
    walletAddress = '',
  } = decisionData || {};
  const { initiatorUser } = action || {};
  const { motionId = '', motionStakes } = motionData || {};
  const navigate = useNavigate();
  const { colony } = useColonyContext();
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
    motionState !== MotionState.Failed &&
    motionState !== MotionState.FailedNotFinalizable &&
    motionState !== MotionState.Passed;

  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 px-5 pb-5 pt-6 sm:min-h-[15.5rem]">
      {loadingAction ? (
        <AgreementCardSkeleton />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
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
          <button
            type="button"
            className="mb-4 text-left transition-colors sm:hover:text-blue-400"
            onClick={() => {
              navigate(
                `${window.location.pathname}?${TX_SEARCH_PARAM}=${transactionId}`,
                {
                  replace: true,
                },
              );
            }}
          >
            <h5 className="mb-2 truncate text-1">{title}</h5>
            {description && (
              <RichTextDisplay
                content={description}
                shouldFormat={false}
                className="line-clamp-4 !text-sm !text-gray-600"
              />
            )}
          </button>
          <div className="flex items-center justify-between gap-2 pt-4 mt-auto border-t border-gray-200">
            <UserInfoPopover
              user={initiatorUser}
              walletAddress={walletAddress}
              withVerifiedBadge={false}
              popperOptions={{
                placement: 'bottom-start',
              }}
              className={clsx(
                'flex items-center text-gray-600 sm:gap-2 sm:hover:text-blue-400',
                {
                  'pointer-events-none': loadingAction,
                },
              )}
            >
              <UserAvatar2
                size={30}
                userAvatarSrc={initiatorUser?.profile?.avatar ?? undefined}
                userAddress={walletAddress}
                userName={initiatorUser?.profile?.displayName ?? undefined}
                className={clsx({
                  'skeleton before:rounded-full': loadingAction,
                })}
              />
              <p
                className={clsx('text-sm hidden sm:inline-block', {
                  skeleton: loadingAction,
                })}
              >
                {loadingAction
                  ? 'Loading...'
                  : formatText(
                      { id: 'agreementsPage.createdBy' },
                      {
                        username:
                          initiatorUser?.profile?.displayName || walletAddress,
                      },
                    )}
              </p>
            </UserInfoPopover>
            <div className="flex items-center gap-2">
              {currentTeam && (
                <TeamBadge
                  name={currentTeam.metadata?.name || ''}
                  color={currentTeam.metadata?.color}
                />
              )}
              {createdAt && (
                <p className="text-sm text-gray-600">
                  {format(new Date(createdAt), 'd MMMM yyyy')}
                </p>
              )}
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
                    label: formatText({ id: 'agreementsPage.viewAgreement' }),
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
