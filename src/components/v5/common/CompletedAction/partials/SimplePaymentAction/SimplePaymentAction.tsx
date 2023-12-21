import moveDecimal from 'move-decimal-point';
import {
  Coins,
  FilePlus,
  HouseLine,
  Scales,
  UserFocus,
  UsersThree,
} from 'phosphor-react';
import React from 'react';
import Tooltip from '~shared/Extensions/Tooltip';
import TokenIcon from '~shared/TokenIcon';
import { ColonyAction } from '~types';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import UserAvatar from '~v5/shared/UserAvatar';
import { ICON_SIZE } from '../../consts';

const displayName = 'v5.common.CompletedAction.partials.SimplePaymentAction';

interface SimplePaymentActionProps {
  action: ColonyAction;
}

const SimplePaymentAction = ({ action }: SimplePaymentActionProps) => {
  const { customTitle = 'Payment' } = action?.metadata || {};

  const transformedAmount = moveDecimal(
    (action.amount || 0).toString(),
    -getTokenDecimalsWithFallback(action.token?.decimals),
  );

  return (
    <div className="flex-grow overflow-y-auto px-6">
      <h3 className="heading-3 mb-2 text-gray-900">{customTitle}</h3>
      <div className="mb-7 text-md">
        Pay {action.recipientUser?.profile?.displayName} {transformedAmount}{' '}
        {action.token?.symbol} by {action.initiatorUser?.profile?.displayName}
      </div>
      <div className="grid grid-cols-[10rem_auto] sm:grid-cols-[12.5rem_auto] gap-y-3 text-md text-gray-900 items-center">
        <div>
          <Tooltip
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.simplePayment.from',
            })}
          >
            <div className="flex items-center gap-2">
              <FilePlus size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.actionType' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>{formatText(action.type)}</div>

        <div>
          <Tooltip
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.simplePayment.from',
            })}
          >
            <div className="flex items-center gap-2">
              <UsersThree size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.from' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          <TeamBadge teamName={action.fromDomain?.metadata?.name} />
        </div>

        <div>
          <Tooltip
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.simplePayment.recipient',
            })}
          >
            <div className="flex items-center gap-2">
              <UserFocus size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.recipent' })}</span>
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

        <div>
          <Tooltip
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.simplePayment.amount',
            })}
          >
            <div className="flex items-center gap-2">
              <Coins size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.amount' })}</span>
            </div>
          </Tooltip>
        </div>

        <div className="flex items-center gap-1">
          {transformedAmount}
          {action.token && (
            <>
              <TokenIcon token={action.token} size="xxs" />
              <span className="text-md">{action.token.symbol}</span>
            </>
          )}
        </div>

        <div>
          <Tooltip
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.decisionMethod',
            })}
          >
            <div className="flex items-center gap-2">
              <Scales size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.decisionMethod' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          {action.isMotion
            ? DecisionMethod.Reputation
            : DecisionMethod.Permissions}
        </div>

        <div>
          <Tooltip
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.createdIn',
            })}
          >
            <div className="flex items-center gap-2">
              <HouseLine size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.createdIn' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          {/* @TODO hook this up */}
          <TeamBadge teamName={action.fromDomain?.metadata?.name} />
        </div>
      </div>
    </div>
  );
};

SimplePaymentAction.displayName = displayName;
export default SimplePaymentAction;
