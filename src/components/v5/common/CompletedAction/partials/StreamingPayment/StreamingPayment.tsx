import { ColonyRole } from '@colony/colony-js';
import {
  Calendar,
  CalendarCheck,
  CalendarPlus,
  Copy,
  HandPalm,
  Prohibit,
  Repeat,
  UserFocus,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import format from 'date-fns/format';
import { BigNumber } from 'ethers';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { ADDRESS_ZERO, APP_URL } from '~constants';
import { Action } from '~constants/actions.ts';
import { ONE_DAY_IN_SECONDS, ONE_HOUR_IN_SECONDS } from '~constants/time.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType, StreamingPaymentEndCondition } from '~gql';
import { useMobile } from '~hooks';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import {
  getAmountPerValue,
  getStreamingPaymentLimit,
} from '~utils/streamingPayments.ts';
import { getNumeralTokenAmount, getSelectedToken } from '~utils/tokens.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  AMOUNT_FIELD_NAME,
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  FROM_FIELD_NAME,
  RECIPIENT_FIELD_NAME,
  TITLE_FIELD_NAME,
  TOKEN_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import {
  END_OPTIONS,
  START_IMMEDIATELY_VALUE,
} from '~v5/common/ActionSidebar/partials/TimeRow/consts.ts';
import { useDecisionMethod } from '~v5/common/CompletedAction/hooks.ts';
import { DEFAULT_DATE_TIME_FORMAT } from '~v5/common/Fields/datepickers/common/consts.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import { type MeatBallMenuItem } from '~v5/shared/MeatBallMenu/types.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/Blocks.tsx';
import ActionData from '../rows/ActionData.tsx';
import ActionTypeRow from '../rows/ActionType.tsx';
import AmountRow from '../rows/Amount.tsx';
import CreatedInRow from '../rows/CreatedIn.tsx';
import DecisionMethodRow from '../rows/DecisionMethod.tsx';
import DescriptionRow from '../rows/Description.tsx';
import TeamFromRow from '../rows/TeamFrom.tsx';

import { type StreamingPaymentProps } from './types.ts';

const displayName = 'v5.common.CompletedAction.partials.StreamingPayment';

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Streaming payment',
  },
});

const StreamingPayment: FC<StreamingPaymentProps> = ({
  action,
  streamingPayment,
}) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const isMobile = useMobile();
  const {
    actionSidebarToggle: [
      ,
      { toggleOn: toggleActionSidebarOn, toggleOff: toggleActionSidebarOff },
    ],
  } = useActionSidebarContext();
  const decisionMethod = useDecisionMethod(action);

  const { loadingStreamingPayment, streamingPaymentData } = streamingPayment;

  if (loadingStreamingPayment) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <SpinnerLoader appearance={{ size: 'huge' }} />
        <p className="text-gray-600">
          {formatText({ id: 'actionSidebar.loading' })}
        </p>
      </div>
    );
  }

  if (!streamingPaymentData) {
    return null;
  }

  const {
    metadata,
    initiatorUser,
    transactionHash,
    isMotion,
    motionData,
    annotation,
    createdAt,
  } = action || {};
  const { customTitle = formatText(MSG.defaultTitle) } = metadata || {};
  const {
    amount,
    tokenAddress,
    recipientAddress,
    interval,
    nativeDomainId,
    endTime,
    startTime,
    metadata: streamingPaymentMetadata,
  } = streamingPaymentData;
  const selectedToken = getSelectedToken(colony, tokenAddress || '');
  const formattedAmount = getNumeralTokenAmount(
    amount || '1',
    selectedToken?.decimals,
  );

  const { endCondition } = streamingPaymentMetadata || {};
  const motionDomain = motionData?.motionDomain ?? null;

  const selectedTeam = findDomainByNativeId(nativeDomainId, colony);
  const limitAmount = getStreamingPaymentLimit({
    streamingPayment: streamingPaymentData,
  });

  const formattedLimitAmount = getNumeralTokenAmount(
    limitAmount || '0',
    selectedToken?.decimals,
  );

  const hasPermissions = addressHasRoles({
    address: user?.walletAddress || '',
    colony,
    requiredRoles: [ColonyRole.Arbitration],
    requiredRolesDomain: streamingPaymentData.nativeDomainId,
  });

  // @todo: update cancel-related logic in separate PR
  const showCancelOption =
    streamingPaymentData.isCancelled &&
    (user?.walletAddress === initiatorUser?.walletAddress || hasPermissions);

  const isCustomInterval =
    Number(interval) !== ONE_HOUR_IN_SECONDS &&
    Number(interval) !== ONE_DAY_IN_SECONDS &&
    Number(interval) !== ONE_DAY_IN_SECONDS * 7;
  const startTimeDate = new Date(Number(startTime) * 1000);

  const isStartImmediately =
    Math.abs(startTimeDate.getTime() - new Date(createdAt).getTime()) < 60000;

  const meatballOptions: MeatBallMenuItem[] = [
    {
      key: '1',
      label: formatText({ id: 'completedAction.redoAction' }),
      icon: Repeat,
      onClick: () => {
        toggleActionSidebarOff();

        setTimeout(() => {
          toggleActionSidebarOn({
            [TITLE_FIELD_NAME]: customTitle,
            [ACTION_TYPE_FIELD_NAME]: Action.StreamingPayment,
            [FROM_FIELD_NAME]: streamingPaymentData?.nativeDomainId,
            [RECIPIENT_FIELD_NAME]: recipientAddress,
            [AMOUNT_FIELD_NAME]: formattedAmount,
            [TOKEN_FIELD_NAME]: selectedToken?.tokenAddress,
            [DECISION_METHOD_FIELD_NAME]: decisionMethod,
            starts: isStartImmediately
              ? START_IMMEDIATELY_VALUE
              : startTimeDate,
            ends:
              endCondition === StreamingPaymentEndCondition.FixedTime
                ? new Date(Number(endTime) * 1000)
                : endCondition,
            period: isCustomInterval
              ? {
                  custom: Number(interval),
                  interval: 'custom',
                }
              : {
                  interval: getAmountPerValue(interval).toLowerCase(),
                },
            limit: limitAmount ? formattedLimitAmount : undefined,
            limitTokenAddress: limitAmount
              ? selectedToken?.tokenAddress
              : undefined,
            [CREATED_IN_FIELD_NAME]: isMotion
              ? motionDomain?.nativeId
              : streamingPaymentData?.nativeDomainId,
            [DESCRIPTION_FIELD_NAME]: annotation?.message,
          });
        }, 500);
      },
    },
    ...(showCancelOption
      ? [
          {
            key: '2',
            label: formatText({ id: 'expenditure.cancelPayment' }),
            icon: Prohibit,
            onClick: () => {},
          },
        ]
      : []),
    {
      key: '3',
      label: formatText({ id: 'expenditure.copyLink' }),
      renderItemWrapper: (itemWrapperProps, children) => (
        <MeatballMenuCopyItem
          textToCopy={`${APP_URL.origin}/${generatePath(COLONY_HOME_ROUTE, {
            colonyName: colony.name,
          })}${COLONY_ACTIVITY_ROUTE}?${TX_SEARCH_PARAM}=${transactionHash}`}
          {...itemWrapperProps}
        >
          {children}
        </MeatballMenuCopyItem>
      ),
      icon: Copy,
    },
  ];

  return (
    <>
      <div className="flex w-full items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatBallMenu
          contentWrapperClassName={clsx('z-[65] sm:min-w-[11.25rem]', {
            '!left-6 right-6': isMobile,
          })}
          items={meatballOptions}
        />
      </div>
      <ActionSubtitle>
        {formatText(
          { id: 'action.title' },
          {
            actionType: ColonyActionType.CreateStreamingPayment,
            amount: formattedAmount,
            tokenSymbol: selectedToken?.symbol,
            period: getAmountPerValue(interval).toLowerCase(),
            recipient: recipientAddress ? (
              <UserInfoPopover
                walletAddress={recipientAddress}
                withVerifiedBadge={false}
                withUserName
              />
            ) : null,
            initiator: initiatorUser ? (
              <UserInfoPopover
                walletAddress={initiatorUser.walletAddress}
                user={initiatorUser}
                withVerifiedBadge={false}
              >
                {initiatorUser.profile?.displayName}
              </UserInfoPopover>
            ) : null,
          },
        )}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />
        {selectedTeam?.metadata && (
          <TeamFromRow
            teamMetadata={selectedTeam.metadata}
            actionType={action.type}
          />
        )}
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.recipient' })}
          rowContent={
            <UserPopover
              walletAddress={recipientAddress || ADDRESS_ZERO}
              size={20}
            />
          }
          RowIcon={UserFocus}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.simplePayment.recipient',
          })}
        />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.starts' })}
          rowContent={
            <p>
              {format(
                new Date(BigNumber.from(Number(startTime) * 1000).toNumber()),
                DEFAULT_DATE_TIME_FORMAT,
              )}
            </p>
          }
          RowIcon={CalendarPlus}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.streamingPayment.starts',
          })}
        />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.ends' })}
          rowContent={
            endCondition === StreamingPaymentEndCondition.FixedTime ? (
              <p>
                {format(
                  new Date(BigNumber.from(Number(endTime) * 1000).toNumber()),
                  DEFAULT_DATE_TIME_FORMAT,
                )}
              </p>
            ) : (
              <p>
                {
                  END_OPTIONS[0].options.find(
                    ({ value }) => value === endCondition,
                  )?.label
                }
              </p>
            )
          }
          RowIcon={CalendarCheck}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.streamingPayment.ends',
          })}
        />
        <AmountRow amount={amount || '1'} token={selectedToken || undefined} />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.amountPer' })}
          rowContent={<p>{getAmountPerValue(interval)}</p>}
          RowIcon={Calendar}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.streamingPayment.amount.per',
          })}
        />
        {endCondition === StreamingPaymentEndCondition.LimitReached &&
          limitAmount && (
            <AmountRow
              amount={limitAmount}
              token={selectedToken || undefined}
              rowLabel={formatText({ id: 'actionSidebar.limit' })}
              tooltipContent={formatText({
                id: 'actionSidebar.tooltip.streamingPayment.limit',
              })}
              RowIcon={HandPalm}
            />
          )}
        <DecisionMethodRow action={action} />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
    </>
  );
};

StreamingPayment.displayName = displayName;

export default StreamingPayment;
