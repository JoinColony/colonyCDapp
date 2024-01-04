import moveDecimal from 'move-decimal-point';
import { ArrowDownRight } from 'phosphor-react';
import React from 'react';
import { defineMessages } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip';
import { ColonyAction } from '~types';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import TeamBadge from '~v5/common/Pills/TeamBadge';
import UserPopover from '~v5/shared/UserPopover';

import { ICON_SIZE } from '../../consts';
import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks/Blocks';
import ActionTypeRow from '../rows/ActionType';
import AmountRow from '../rows/Amount';
import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';
import DescriptionRow from '../rows/Description';
import TeamFromRow from '../rows/TeamFrom';

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
  const { initiatorUser } = action;
  const transformedAmount = moveDecimal(
    action.amount || '0',
    -getTokenDecimalsWithFallback(action.token?.decimals),
  );

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          amount: transformedAmount,
          token: action.token?.symbol,
          fromDomain: action.fromDomain?.metadata?.name,
          toDomain: action.toDomain?.metadata?.name,
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
