import React from 'react';
import moveDecimal from 'move-decimal-point';

import { ArrowDownRight } from 'phosphor-react';
import { ColonyAction } from '~types';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import AmountRow from '../rows/Amount';
import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';
import ActionTypeRow from '../rows/ActionType';
import TeamFromRow from '../rows/TeamFrom';
import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import { ICON_SIZE } from '../../consts';
import DescriptionRow from '../rows/Description';
import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks/Blocks';

const displayName = 'v5.common.CompletedAction.partials.TransferFunds';

interface TransferFundsProps {
  action: ColonyAction;
}

const TransferFunds = ({ action }: TransferFundsProps) => {
  const { customTitle = 'Transfer funds' } = action?.metadata || {};
  const transformedAmount = moveDecimal(
    action.amount || '0',
    -getTokenDecimalsWithFallback(action.token?.decimals),
  );

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        Move {transformedAmount} {action.token?.symbol} from{' '}
        {action.fromDomain?.metadata?.name} to {action.toDomain?.metadata?.name}{' '}
        by {action.initiatorUser?.profile?.displayName}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />

        {action.fromDomain?.metadata && (
          <TeamFromRow teamMetadata={action.fromDomain.metadata} />
        )}

        <div>
          <Tooltip
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.transferFunds.to',
            })}
          >
            <div className="flex items-center gap-2">
              <ArrowDownRight size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.recipent' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          <TeamBadge teamName={action.toDomain?.metadata?.name} />
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

TransferFunds.displayName = displayName;
export default TransferFunds;
