import { ColonyRole } from '@colony/colony-js';
import { Copy, Prohibit } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { APP_URL } from '~constants';
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
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import { type MeatBallMenuItem } from '~v5/shared/MeatBallMenu/types.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import ActionTypeRow from '../rows/ActionType.tsx';
import CreatedInRow from '../rows/CreatedIn.tsx';
import DecisionMethodRow from '../rows/DecisionMethod.tsx';
import DescriptionRow from '../rows/Description.tsx';
import TeamFromRow from '../rows/TeamFrom.tsx';

import CancelModal from './partials/CancelModal/CancelModal.tsx';
import PaymentBuilderTable from './partials/PaymentBuilderTable/PaymentBuilderTable.tsx';

interface PaymentBuilderProps {
  action: ColonyAction;
}

const displayName = 'v5.common.CompletedAction.partials.PaymentBuilder';

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Payment builder',
  },
});

const PaymentBuilder = ({ action }: PaymentBuilderProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser, transactionHash } = action;
  const isMobile = useMobile();
  const [
    isCancelModalOpen,
    { toggleOn: toggleCancelModalOn, toggleOff: toggleCancelModalOff },
  ] = useToggle();

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

  const { slots = [], metadata, status, finalizedAt } = expenditure;

  const selectedTeam = findDomainByNativeId(
    metadata?.fundFromDomainNativeId,
    colony,
  );

  const recipientCounts = slots.reduce((uniqueAddresses: string[], item) => {
    const address = item.recipientAddress;
    if (address) {
      if (!uniqueAddresses.includes(address)) {
        uniqueAddresses.push(address);
      }
    }

    return uniqueAddresses;
  }, []).length;

  const tokensCount = slots.reduce((uniqueTokens: string[], item) => {
    const token = item.payouts?.[0].tokenAddress;

    if (token) {
      if (!uniqueTokens.includes(token)) {
        uniqueTokens.push(token);
      }
    }

    return uniqueTokens;
  }, []).length;

  const hasPermissions = addressHasRoles({
    address: user?.walletAddress || '',
    colony,
    requiredRoles: [ColonyRole.Arbitration],
    requiredRolesDomains: [expenditure.nativeDomainId],
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
          items={expenditureMeatballOptions}
        />
      </div>
      <ActionSubtitle>
        {formatText(
          { id: 'action.title' },
          {
            actionType: ColonyActionType.CreateExpenditure,
            recipientsNumber: recipientCounts,
            tokensNumber: tokensCount,
            initiator: initiatorUser ? (
              <UserPopover
                userName={initiatorUser.profile?.displayName}
                walletAddress={initiatorUser.walletAddress}
                user={initiatorUser}
                withVerifiedBadge={false}
              >
                {initiatorUser.profile?.displayName}
              </UserPopover>
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

        <DecisionMethodRow isMotion={action.isMotion || false} />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
      <PaymentBuilderTable
        items={slots}
        status={status}
        finalizedTimestamp={finalizedAt}
        isLoading={!slots.length}
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
