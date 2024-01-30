import { UserFocus } from 'phosphor-react';
import React from 'react';
import { defineMessages } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';
import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import {
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
  const { amount, initiatorUser, recipientUser, token } = action;

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
            placement={DEFAULT_TOOLTIP_POSITION}
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
