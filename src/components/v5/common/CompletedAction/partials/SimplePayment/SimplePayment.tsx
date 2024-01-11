import moveDecimal from 'move-decimal-point';
import { UserFocus } from 'phosphor-react';
import React from 'react';
import { defineMessages } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip';
import { ColonyAction } from '~types';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import UserAvatar from '~v5/shared/UserAvatar';
import UserPopover from '~v5/shared/UserPopover';

import { ICON_SIZE } from '../../consts';
import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks';
import {
  ActionTypeRow,
  AmountRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
  TeamFromRow,
} from '../rows';

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
  const { initiatorUser, recipientUser } = action;

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
          recipient: recipientUser ? (
            <UserPopover
              userName={recipientUser.profile?.displayName}
              walletAddress={recipientUser.walletAddress}
              user={recipientUser}
              withVerifiedBadge={false}
            >
              {recipientUser.profile?.displayName}
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
          <TeamFromRow teamMetadata={action.fromDomain.metadata} />
        )}

        <div>
          <Tooltip
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.simplePayment.recipient',
            })}
          >
            <div className="flex items-center gap-2">
              <UserFocus size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.recipient' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          <UserAvatar
            user={{
              profile: action.recipientUser?.profile,
              walletAddress: action.recipientAddress || '',
            }}
            size="xs"
            showUsername
          />
        </div>

        <AmountRow
          amount={action.amount || '0'}
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

SimplePayment.displayName = displayName;
export default SimplePayment;
