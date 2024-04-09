import { ArrowDownRight } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import {
  ActionData,
  ActionTypeRow,
  AmountRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
  TeamFromRow,
} from '../rows/index.ts';
import { getFormattedTokenAmount } from '../utils.ts';

const displayName = 'v5.common.CompletedAction.partials.TransferFunds';

interface TransferFundsProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Transfer funds',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage:
      'Move {amount} {token} from {fromDomain} to {toDomain} by {user}',
  },
});

const TransferFunds = ({ action }: TransferFundsProps) => {
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { amount, initiatorUser, token } = action;

  const formattedAmount = getFormattedTokenAmount(
    amount || '1',
    token?.decimals,
  );

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          amount: formattedAmount,
          token: action.token?.symbol,
          fromDomain: action.fromDomain?.metadata?.name,
          toDomain: action.toDomain?.metadata?.name,
          user: initiatorUser ? (
            <UserInfoPopover
              walletAddress={initiatorUser.walletAddress}
              user={initiatorUser}
              withVerifiedBadge={false}
            >
              {initiatorUser.profile?.displayName}
            </UserInfoPopover>
          ) : null,
        })}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />

        {action.fromDomain?.metadata && (
          <TeamFromRow
            teamMetadata={action.fromDomain.metadata}
            actionType={action.type}
          />
        )}
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.to' })}
          rowContent={
            action.toDomain?.metadata?.name ? (
              <TeamBadge
                name={action.toDomain?.metadata?.name}
                color={action.toDomain?.metadata?.color}
              />
            ) : null
          }
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.transferFunds.to',
          })}
          RowIcon={ArrowDownRight}
        />

        <AmountRow
          amount={action.amount || '1'}
          token={action.token || undefined}
        />

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
    </>
  );
};

TransferFunds.displayName = displayName;
export default TransferFunds;
