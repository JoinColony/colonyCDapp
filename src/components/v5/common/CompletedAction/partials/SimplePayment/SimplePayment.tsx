import { UserFocus } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { ADDRESS_ZERO } from '~constants';
import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover/index.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

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

const displayName = 'v5.common.CompletedAction.partials.SimplePayment';

interface SimplePaymentProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Simple payment',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Pay {recipient} {amount} {token} by {user}',
  },
});

const SimplePayment = ({ action }: SimplePaymentProps) => {
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { amount, initiatorUser, recipientAddress, recipientUser, token } =
    action;

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
          recipient: recipientAddress ? (
            <UserPopover
              userName={recipientUser?.profile?.displayName}
              walletAddress={recipientAddress}
              user={recipientUser}
              withVerifiedBadge={false}
            >
              {recipientUser?.profile?.displayName ||
                splitWalletAddress(recipientAddress)}
            </UserPopover>
          ) : null,
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

        {action.fromDomain?.metadata && (
          <TeamFromRow
            teamMetadata={action.fromDomain.metadata}
            actionType={action.type}
          />
        )}
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.recipient' })}
          rowContent={
            <UserAvatarPopover
              walletAddress={action.recipientAddress || ADDRESS_ZERO}
              size="xs"
            />
          }
          RowIcon={UserFocus}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.simplePayment.recipient',
          })}
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

SimplePayment.displayName = displayName;
export default SimplePayment;
