import { ColonyRole } from '@colony/colony-js';
import { ChartPieSlice, Copy, Prohibit, Repeat } from '@phosphor-icons/react';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { APP_URL } from '~constants';
import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ExpenditureStatus } from '~gql';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import Numeral from '~shared/Numeral/Numeral.tsx';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { DecisionMethod, ExtendedColonyActionType } from '~types/actions.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  AMOUNT_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TEAM_FIELD_NAME,
  TITLE_FIELD_NAME,
  TOKEN_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import { distributionMethodOptions } from '~v5/common/ActionSidebar/partials/consts.tsx';
import { calculatePercentageValue } from '~v5/common/ActionSidebar/partials/forms/SplitPaymentForm/partials/SplitPaymentRecipientsField/utils.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import { type MeatBallMenuItem } from '~v5/shared/MeatBallMenu/types.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/Blocks.tsx';
import CancelModal from '../PaymentBuilder/partials/CancelModal/CancelModal.tsx';
import {
  ActionData,
  ActionTypeRow,
  AmountRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
  TeamFromRow,
} from '../rows/index.ts';

import SplitPaymentTable from './partials/SplitPaymentTable/SplitPaymentTable.tsx';

interface SplitPaymentProps {
  action: ColonyAction;
}

const displayName = 'v5.common.CompletedAction.partials.SplitPayment';

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Split payment',
  },
  unknownDistributionType: {
    id: `${displayName}.unknownDistributionType`,
    defaultMessage: 'Unknown',
  },
});

const SplitPayment = ({ action }: SplitPaymentProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser, transactionHash, annotation } = action;
  const isMobile = useMobile();
  const [
    isCancelModalOpen,
    { toggleOn: toggleCancelModalOn, toggleOff: toggleCancelModalOff },
  ] = useToggle();
  const {
    actionSidebarToggle: [
      ,
      { toggleOn: toggleActionSidebarOn, toggleOff: toggleActionSidebarOff },
    ],
  } = useActionSidebarContext();

  const { expenditure, loadingExpenditure, refetchExpenditure } =
    useGetExpenditureData(action.expenditureId);

  if (loadingExpenditure) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <SpinnerLoader appearance={{ size: 'huge' }} />
        <p className="text-gray-600">
          {formatText({ id: 'actionSidebar.loading' })}
        </p>
      </div>
    );
  }

  if (!expenditure) {
    return null;
  }

  const { slots = [], metadata, status, isStaked } = expenditure;
  const { fundFromDomainNativeId, distributionType } = metadata || {};

  const selectedTeam = findDomainByNativeId(fundFromDomainNativeId, colony);

  const hasPermissions = addressHasRoles({
    address: user?.walletAddress || '',
    colony,
    requiredRoles: [ColonyRole.Arbitration],
    requiredRolesDomain: expenditure.nativeDomainId,
  });
  const showCancelOption =
    expenditure?.status !== ExpenditureStatus.Cancelled &&
    expenditure?.status !== ExpenditureStatus.Finalized &&
    (user?.walletAddress === initiatorUser?.walletAddress || hasPermissions);

  const splitToken =
    !!slots.length &&
    !!slots[0].payouts?.length &&
    slots[0].payouts[0].tokenAddress
      ? getSelectedToken(colony, slots[0].payouts[0].tokenAddress)
      : undefined;

  const amount = slots
    .flatMap((slot) => slot.payouts || [])
    .reduce((acc, curr) => {
      return BigNumber.from(acc)
        .add(BigNumber.from(curr?.amount || '0'))
        .toString();
    }, '0');
  const formattedAmount = moveDecimal(
    amount,
    -getTokenDecimalsWithFallback(splitToken?.decimals),
  );
  const redoAmount = moveDecimal(
    amount,
    -getTokenDecimalsWithFallback(splitToken?.decimals),
  );

  const expenditureMeatballOptions: MeatBallMenuItem[] = [
    {
      key: '1',
      label: formatText({ id: 'completedAction.redoAction' }),
      icon: Repeat,
      onClick: () => {
        toggleActionSidebarOff();

        setTimeout(() => {
          toggleActionSidebarOn({
            [TITLE_FIELD_NAME]: customTitle,
            [ACTION_TYPE_FIELD_NAME]: Action.SplitPayment,
            distributionMethod: distributionType,
            [TEAM_FIELD_NAME]: fundFromDomainNativeId,
            [AMOUNT_FIELD_NAME]:
              typeof redoAmount === 'string'
                ? redoAmount.replace(',', '')
                : redoAmount,
            payments: slots.map((slot) => {
              const currentAmount = moveDecimal(
                slot.payouts?.[0].amount,
                -getTokenDecimalsWithFallback(splitToken?.decimals),
              );

              return {
                recipient: slot.recipientAddress,
                amount: currentAmount,
                tokenAddress: slot.payouts?.[0].tokenAddress,
                percent: calculatePercentageValue(
                  currentAmount,
                  formattedAmount,
                ),
              };
            }),
            [TOKEN_FIELD_NAME]: splitToken?.tokenAddress,
            [DECISION_METHOD_FIELD_NAME]: isStaked
              ? DecisionMethod.Staking
              : DecisionMethod.Permissions,
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
            onClick: toggleCancelModalOn,
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
          hasLeftAlignment
          items={expenditureMeatballOptions}
        />
      </div>
      <ActionSubtitle>
        {formatText(
          { id: 'action.title' },
          {
            actionType: ExtendedColonyActionType.SplitPayment,
            splitAmount: (
              <Numeral value={amount} decimals={splitToken?.decimals} />
            ),
            tokenSymbol: splitToken?.symbol,
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
        <ActionTypeRow actionType={ExtendedColonyActionType.SplitPayment} />

        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.distribution' })}
          rowContent={
            distributionMethodOptions.find(
              ({ value }) => value === distributionType,
            )?.label || formatText(MSG.unknownDistributionType)
          }
          RowIcon={ChartPieSlice}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.distributionTypes',
          })}
        />

        {selectedTeam?.metadata && (
          <TeamFromRow
            teamMetadata={selectedTeam.metadata}
            actionType={action.type}
          />
        )}
        <AmountRow amount={amount || '1'} token={splitToken} />

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

      <SplitPaymentTable
        items={slots}
        status={status}
        isLoading={!slots.length || !!loadingExpenditure}
      />

      <CancelModal
        isOpen={isCancelModalOpen}
        expenditure={expenditure}
        onClose={toggleCancelModalOff}
        refetchExpenditure={refetchExpenditure}
      />
    </>
  );
};

SplitPayment.displayName = displayName;

export default SplitPayment;
