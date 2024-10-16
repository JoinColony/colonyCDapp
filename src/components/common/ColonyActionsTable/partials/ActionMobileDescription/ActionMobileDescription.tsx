import clsx from 'clsx';
import React, { type FC } from 'react';

import getActionTitleValues from '~common/ColonyActions/helpers/getActionTitleValues.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import useShouldDisplayMotionCountdownTime from '~hooks/useShouldDisplayMotionCountdownTime.ts';
import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';
import { formatText } from '~utils/intl.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/index.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';

import ActionBadge from '../ActionBadge/ActionBadge.tsx';

import { type ActionMobileDescriptionProps } from './types.ts';

const ActionMobileDescription: FC<ActionMobileDescriptionProps> = ({
  actionRow,
  refetchMotionStates,
  loadingMotionStates,
  loading,
  getMenuProps,
}) => {
  const { colony } = useColonyContext();
  const { original: action } = actionRow;

  const {
    isMotion,
    motionData,
    motionState,
    fromDomain,
    createdAt,
    expenditureId,
  } = action;

  const { expenditure, loadingExpenditure } =
    useGetExpenditureData(expenditureId);

  const isLoading = loading || !!loadingExpenditure;

  const shouldShowCounter = useShouldDisplayMotionCountdownTime(
    motionState || null,
  );

  const { networkInverseFee } = useNetworkInverseFee();

  const refetchMotionState = () => {
    if (!motionData) {
      return;
    }

    refetchMotionStates([motionData.motionId]);
  };

  const actionMetadataDescription = formatText(
    { id: 'action.title' },
    getActionTitleValues({
      actionData: action,
      colony,
      expenditureData: expenditure ?? undefined,
      networkInverseFee,
    }),
  );
  const team = fromDomain?.metadata || motionData?.motionDomain.metadata;
  const date = getFormattedDateFrom(createdAt);
  const meatBallMenuProps = getMenuProps(actionRow);
  const textClassName = 'font-normal text-sm';

  const renderLabel = (chunks: string[]) => (
    <p className={clsx(textClassName, 'inline-block')}>{chunks}</p>
  );

  return (
    <div className="expandable flex items-start justify-between gap-1 pb-4 pl-[1.125rem] pr-[.9375rem]">
      <div className="flex flex-col gap-2 text-gray-500">
        {shouldShowCounter && isMotion && motionData && motionState && (
          <MotionCountDownTimer
            className="flex-shrink-0 text-xs font-medium text-negative-400"
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
        <p
          className={clsx(textClassName, 'text-gray-600', {
            skeleton: isLoading,
          })}
        >
          {actionMetadataDescription}
        </p>
        {team && (
          <div className="flex items-center gap-2">
            {formatText(
              { id: 'activityFeedTable.table.team' },
              {
                teamBadge: (
                  <TeamBadge
                    textClassName="line-clamp-1 break-all"
                    name={team?.name || ''.padEnd(6, '-')}
                    color={team?.color}
                  />
                ),
                p: renderLabel,
              },
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          {formatText(
            { id: 'activityFeedTable.table.date' },
            {
              date: (
                <span className={clsx(textClassName, 'text-gray-600')}>
                  {date}
                </span>
              ),
              p: renderLabel,
            },
          )}
        </div>
        <div className="flex items-center gap-2">
          {formatText(
            { id: 'activityFeedTable.table.status' },
            {
              statusBadge: (
                <ActionBadge
                  motionState={motionState}
                  loading={loadingMotionStates || isLoading}
                  expenditureId={expenditureId ?? undefined}
                />
              ),
              p: renderLabel,
            },
          )}
        </div>
      </div>
      {meatBallMenuProps && (
        <MeatBallMenu
          {...meatBallMenuProps}
          contentWrapperClassName="!left-6 right-6"
          buttonClassName={(isMenuOpen) =>
            clsx({ '!text-gray-600': !isMenuOpen })
          }
          iconSize={18}
        />
      )}
    </div>
  );
};

export default ActionMobileDescription;
