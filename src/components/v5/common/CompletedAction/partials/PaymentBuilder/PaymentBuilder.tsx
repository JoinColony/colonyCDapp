import { ColonyRole } from '@colony/colony-js';
import { Copy, Prohibit } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { APP_URL } from '~constants';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ExpenditureStatus, ExpenditureType } from '~gql';
import useToggle from '~hooks/useToggle/index.ts';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { ExtendedColonyActionType } from '~types/actions.ts';
import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
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
});

const PaymentBuilder = ({ action }: PaymentBuilderProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser, transactionHash } = action;
  const [
    isCancelModalOpen,
    { toggleOn: toggleCancelModalOn, toggleOff: toggleCancelModalOff },
  ] = useToggle();

  const { expenditure, loadingExpenditure, refetchExpenditure } =
    useGetExpenditureData(action.expenditureId);
  const expenditureStep = getExpenditureStep(expenditure);
  const { user: recipient } = useUserByAddress(
    expenditure?.slots?.[0]?.recipientAddress || '',
  );

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

  const { slots = [], metadata, status, finalizedAt } = expenditure;

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
            onClick: toggleCancelModalOn,
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
        />
        <StagedPaymentTable
          stages={expenditure.metadata?.stages || []}
          slots={slots}
          isLoading={!expenditure.metadata?.stages?.length}
          isReleaseStep={expenditureStep === ExpenditureStep.Release}
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
        onClose={toggleCancelModalOff}
        refetchExpenditure={refetchExpenditure}
      />
    </>
  );
};

PaymentBuilder.displayName = displayName;

export default PaymentBuilder;
