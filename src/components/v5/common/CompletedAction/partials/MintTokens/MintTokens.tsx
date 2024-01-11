import moveDecimal from 'move-decimal-point';
import React from 'react';
import { defineMessages } from 'react-intl';

import { ColonyAction } from '~types';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import UserPopover from '~v5/shared/UserPopover';

import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks';
import {
  ActionTypeRow,
  AmountRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
} from '../rows';

const displayName = 'v5.common.CompletedAction.partials.MintTokens';

interface MintTokensProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Minting new tokens',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Mint {amount} {token} by {user}',
  },
});

const MintTokens = ({ action }: MintTokensProps) => {
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser } = action;
  const transformedAmount = moveDecimal(
    action.amount || '1',
    -getTokenDecimalsWithFallback(action.token?.decimals),
  );

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          amount: transformedAmount,
          token: action.token?.symbol,
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

        {action.annotation?.message && (
          <DescriptionRow description={action.annotation.message} />
        )}
      </ActionDataGrid>
    </>
  );
};

MintTokens.displayName = displayName;
export default MintTokens;
