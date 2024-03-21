import React from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type Expenditure, type ColonyAction } from '~types/graphql.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
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

interface PaymentBuilderProps {
  expenditure: Expenditure;
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

const PaymentBuilder = ({ expenditure, action }: PaymentBuilderProps) => {
  const { colony } = useColonyContext();
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser } = action;

  const selectedTeam = findDomainByNativeId(
    expenditure.metadata?.fundFromDomainNativeId,
    colony,
  );

  const recipientCounts = expenditure.slots.reduce(
    (uniqueAddresses: string[], item) => {
      const address = item.recipientAddress;
      if (address) {
        if (!uniqueAddresses.includes(address)) {
          uniqueAddresses.push(address);
        }
      }

      return uniqueAddresses;
    },
    [],
  ).length;

  const tokensCount = expenditure.slots.reduce(
    (uniqueTokens: string[], item) => {
      const token = item.payouts?.[0].tokenAddress;

      if (token) {
        if (!uniqueTokens.includes(token)) {
          uniqueTokens.push(token);
        }
      }

      return uniqueTokens;
    },
    [],
  ).length;

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

      <PaymentBuilderTable items={expenditure.slots} />
    </>
  );
};

PaymentBuilder.displayName = displayName;

export default PaymentBuilder;
