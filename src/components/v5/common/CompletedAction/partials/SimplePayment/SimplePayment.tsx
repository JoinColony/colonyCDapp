import moveDecimal from 'move-decimal-point';
import { FilePlus, UserFocus, UsersThree } from 'phosphor-react';
import React from 'react';
import Tooltip from '~shared/Extensions/Tooltip';
import { ColonyAction } from '~types';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import UserAvatar from '~v5/shared/UserAvatar';
import { ICON_SIZE } from '../../consts';
import AmountRow from '../rows/Amount';
import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';

const displayName = 'v5.common.CompletedAction.partials.SimplePayment';

interface SimplePaymentProps {
  action: ColonyAction;
}

const SimplePayment = ({ action }: SimplePaymentProps) => {
  const { customTitle = 'Payment' } = action?.metadata || {};

  const transformedAmount = moveDecimal(
    action.amount || '0',
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
      </div>
    </div>
  );
};

SimplePayment.displayName = displayName;
export default SimplePayment;
