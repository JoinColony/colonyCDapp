import { ColonyRole } from '@colony/colony-js';
import { Copy, Prohibit } from '@phosphor-icons/react';
import moveDecimal from 'move-decimal-point';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { APP_URL } from '~constants';
import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { ExpenditureStatus, ExpenditureType } from '~gql';
import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import useGetExpenditureData from '~hooks/useGetExpenditureData.ts';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { DecisionMethod, ExtendedColonyActionType } from '~types/actions.ts';
import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { convertPeriodToHours } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  FROM_FIELD_NAME,
  RECIPIENT_FIELD_NAME,
  TITLE_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { type MeatBallMenuItem } from '~v5/shared/MeatBallMenu/types.ts';

import CompletedExpenditureContent from '../CompletedExpenditureContent/CompletedExpenditureContent.tsx';

import CancelModal from './partials/CancelModal/CancelModal.tsx';
import PaymentBuilderTable from './partials/PaymentBuilderTable/PaymentBuilderTable.tsx';
import { ExpenditureStep } from './partials/PaymentBuilderWidget/types.ts';
import { getExpenditureStep } from './partials/PaymentBuilderWidget/utils.ts';
import StagedPaymentTable from './partials/StagedPaymentTable/StagedPaymentTable.tsx';

interface PaymentBuilderProps {
  action: ColonyAction;
}

const displayName = 'v5.common.CompletedAction.partials.PaymentBuilder';

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Advanced payment',
  },
  uninstalledExtension: {
    id: `${displayName}.uninstalledExtension`,
    defaultMessage:
      'The extension used to create this action has been uninstalled. We recommend canceling this action.',
  },
  cancelPayment: {
    id: `${displayName}.cancelPayment`,
    defaultMessage: 'Cancel payment',
  },
});

const PaymentBuilder = ({ action }: PaymentBuilderProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser, transactionHash, fromDomain, annotation } = action;
  const allTokens = useGetAllTokens();

  const { expenditure, loadingExpenditure, refetchExpenditure } =
    useGetExpenditureData(action.expenditureId);
  const expenditureStep = getExpenditureStep(expenditure);
  const { user: recipient } = useUserByAddress(
    expenditure?.slots?.[0]?.recipientAddress || '',
  );
  const {
    expectedExpenditureType,
    setExpectedExpenditureType,
    isCancelModalOpen,
    toggleOnCancelModal,
    toggleOffCancelModal,
  } = usePaymentBuilderContext();

  useEffect(() => {
    if (expenditure?.type && expectedExpenditureType === undefined) {
      setExpectedExpenditureType(expenditure.type);
    }
  }, [expectedExpenditureType, expenditure?.type, setExpectedExpenditureType]);

  useEffect(() => {
    return () => {
      setExpectedExpenditureType(undefined);
    };
  }, [setExpectedExpenditureType]);

  if (loadingExpenditure || expectedExpenditureType !== expenditure?.type) {
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

  const { slots = [], metadata, status, finalizedAt, isStaked } = expenditure;

  const selectedTeam = findDomainByNativeId(
    metadata?.fundFromDomainNativeId,
    colony,
  );

  const { expectedNumberOfPayouts } = metadata || {};

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

  const expenditureMeatballOptions: MeatBallMenuItem[] = [
    ...(showCancelOption
      ? [
          {
            key: '1',
            label: formatText({ id: 'expenditure.cancelPayment' }),
            icon: Prohibit,
            onClick: toggleOnCancelModal,
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

  if (expenditure.type === ExpenditureType.Staged) {
    return (
      <>
        <CompletedExpenditureContent
          title={customTitle}
          expenditureMeatballOptions={expenditureMeatballOptions}
          initiatorUser={initiatorUser}
          recipient={recipient}
          selectedTeam={selectedTeam}
          actionType={ExtendedColonyActionType.StagedPayment}
          action={action}
          expenditure={expenditure}
          redoAction={Action.StagedPayment}
          redoActionValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [FROM_FIELD_NAME]: fromDomain?.nativeId,
            [RECIPIENT_FIELD_NAME]: recipient?.walletAddress,
            [DECISION_METHOD_FIELD_NAME]: isStaked
              ? DecisionMethod.Staking
              : DecisionMethod.Permissions,
            [CREATED_IN_FIELD_NAME]: fromDomain?.nativeId,
            [DESCRIPTION_FIELD_NAME]: annotation?.message,
            stages: (expenditure.metadata?.stages || []).map((stage) => {
              const currentSlot = slots.find(
                (slot) => slot.id === stage.slotId,
              );
              const token = allTokens.find(
                ({ token: currentToken }) =>
                  currentToken.tokenAddress ===
                  currentSlot?.payouts?.[0].tokenAddress,
              );

              return {
                milestone: stage.name,
                amount: moveDecimal(
                  currentSlot?.payouts?.[0].amount,
                  -getTokenDecimalsWithFallback(token?.token.decimals),
                ),
                tokenAddress: currentSlot?.payouts?.[0].tokenAddress,
              };
            }),
          }}
        />
        <StagedPaymentTable
          finalizedAt={finalizedAt || 0}
          expenditure={expenditure}
          isLoading={!expenditure.metadata?.stages?.length}
          isPaymentStep={expenditureStep === ExpenditureStep.Payment}
        />
        <CancelModal
          isOpen={isCancelModalOpen}
          expenditure={expenditure}
          onClose={toggleOffCancelModal}
          refetchExpenditure={refetchExpenditure}
        />
      </>
    );
  }

  return (
    <>
      <CompletedExpenditureContent
        title={customTitle}
        expenditureMeatballOptions={expenditureMeatballOptions}
        initiatorUser={initiatorUser}
        recipient={recipient}
        selectedTeam={selectedTeam}
        actionType={ColonyActionType.CreateExpenditure}
        action={action}
        expenditure={expenditure}
        redoAction={Action.PaymentBuilder}
        redoActionValues={{
          [TITLE_FIELD_NAME]: customTitle,
          [FROM_FIELD_NAME]: fromDomain?.nativeId,
          [DECISION_METHOD_FIELD_NAME]: isStaked
            ? DecisionMethod.Staking
            : DecisionMethod.Permissions,
          [CREATED_IN_FIELD_NAME]: fromDomain?.nativeId,
          [DESCRIPTION_FIELD_NAME]: annotation?.message,
          payments: slots.map((slot) => {
            const token = allTokens.find(
              ({ token: currentToken }) =>
                currentToken.tokenAddress === slot.payouts?.[0].tokenAddress,
            );

            return {
              recipient: slot.recipientAddress,
              amount: moveDecimal(
                slot.payouts?.[0].amount,
                -getTokenDecimalsWithFallback(token?.token.decimals),
              ),
              tokenAddress: slot.payouts?.[0].tokenAddress,
              delay: convertPeriodToHours(slot.claimDelay || '0'),
            };
          }),
        }}
      />
      <PaymentBuilderTable
        items={slots}
        status={status}
        finalizedTimestamp={finalizedAt}
        expectedNumberOfPayouts={expectedNumberOfPayouts}
      />
      <CancelModal
        isOpen={isCancelModalOpen}
        expenditure={expenditure}
        onClose={toggleOffCancelModal}
        refetchExpenditure={refetchExpenditure}
      />
    </>
  );
};

PaymentBuilder.displayName = displayName;

export default PaymentBuilder;
