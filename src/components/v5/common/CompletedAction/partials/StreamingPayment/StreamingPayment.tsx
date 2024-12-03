import { useApolloClient } from '@apollo/client';
import { ColonyRole } from '@colony/colony-js';
import {
  Calendar,
  CalendarCheck,
  CalendarPlus,
  Copy,
  HandPalm,
  Prohibit,
  UserFocus,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import format from 'date-fns/format';
import { BigNumber } from 'ethers';
import React, { useEffect, type FC } from 'react';
import { defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { ADDRESS_ZERO, APP_URL } from '~constants';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  ColonyActionType,
  SearchStreamingPaymentsDocument,
  StreamingPaymentEndCondition,
} from '~gql';
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
import { isQueryActive } from '~utils/isQueryActive.ts';
import {
  getAmountPerValue,
  getStreamingPaymentLimit,
} from '~utils/streamingPayments.ts';
import { getNumeralTokenAmount, getSelectedToken } from '~utils/tokens.ts';
import { END_OPTIONS } from '~v5/common/ActionSidebar/partials/TimeRow/consts.ts';
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
  const client = useApolloClient();

  const { loadingStreamingPayment, streamingPaymentData } = streamingPayment;

  useEffect(() => {
    if (isQueryActive('SearchStreamingPayments')) {
      client.refetchQueries({
        include: [SearchStreamingPaymentsDocument],
      });
    }
  }, [client]);

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

  const { metadata, initiatorUser, transactionHash } = action || {};
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

  const selectedTeam = findDomainByNativeId(nativeDomainId, colony);
  const limitAmount = getStreamingPaymentLimit({
    streamingPayment: streamingPaymentData,
  });

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

  const meatballOptions: MeatBallMenuItem[] = [
    ...(showCancelOption
      ? [
          {
            key: '1',
            label: formatText({ id: 'expenditure.cancelPayment' }),
            icon: Prohibit,
            onClick: () => {},
          },
        ]
      : []),
    {
      key: '2',
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
          dropdownPlacementProps={{
            top: 12,
          }}
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
