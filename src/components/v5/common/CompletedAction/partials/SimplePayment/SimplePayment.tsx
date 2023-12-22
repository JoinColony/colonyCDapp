import moveDecimal from 'move-decimal-point';
import { UserFocus } from 'phosphor-react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip';
import { ColonyAction } from '~types';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import UserAvatar from '~v5/shared/UserAvatar';

import { ICON_SIZE } from '../../consts';
import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks/Blocks';
import ActionTypeRow from '../rows/ActionType';
import AmountRow from '../rows/Amount';
import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';
import DescriptionRow from '../rows/Description';
import TeamFromRow from '../rows/TeamFrom';

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
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        Pay {action.recipientUser?.profile?.displayName} {transformedAmount}{' '}
        {action.token?.symbol} by {action.initiatorUser?.profile?.displayName}
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

        {action.annotation?.message && (
          <DescriptionRow description={action.annotation.message} />
        )}
      </ActionDataGrid>
    </>
  );
};

SimplePayment.displayName = displayName;
export default SimplePayment;
