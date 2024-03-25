import React from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useToggle from '~hooks/useToggle/index.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { type ColonyAction } from '~types/graphql.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
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
import PaymentBuilderTable from '../rows/PaymentBuilderTable/PaymentBuilderTable.tsx';
import TeamFromRow from '../rows/TeamFrom.tsx';

import FundingModal from './partials/FundingModal/FundingModal.tsx';

interface PaymentBuilderProps {
  action: ColonyAction;
}

const displayName = 'v5.common.CompletedAction.partials.PaymentBuilder';

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Payment builder',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage:
      'Payment to {recipientsNumber} {recipientsNumber, plural, one {recipient} other {recipients}} with {tokensNumber} {tokensNumber, plural, one {token} other {tokens}} by {user}',
  },
});

const PaymentBuilder = ({ action }: PaymentBuilderProps) => {
  const { colony } = useColonyContext();
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser } = action;
  const [isFundingModalOpen, { toggleOn, toggleOff }] = useToggle();

  const { expenditure, loadingExpenditure } = useGetExpenditureData(
    action.expenditureId,
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

  const { slots = [], metadata } = expenditure;

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

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          recipientsNumber: recipientCounts,
          tokensNumber: tokensCount,
          user: initiatorUser ? (
            <UserPopover
              userName={initiatorUser.profile?.displayName}
              walletAddress={initiatorUser.walletAddress}
              user={initiatorUser}
              withVerifiedBadge={false}
            >
              {initiatorUser.profile?.displayName}
            </UserPopover>
          ) : null,
        })}
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
      {!!slots.length && <PaymentBuilderTable items={slots} />}

      <button type="button" onClick={toggleOn}>
        temp fund
      </button>

      <FundingModal
        isOpen={isFundingModalOpen}
        onClose={toggleOff}
        expenditure={expenditure}
      />
    </>
  );
};

PaymentBuilder.displayName = displayName;

export default PaymentBuilder;
