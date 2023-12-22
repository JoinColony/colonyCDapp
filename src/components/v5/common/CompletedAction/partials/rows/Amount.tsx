import moveDecimal from 'move-decimal-point';
import { Coins } from 'phosphor-react';
import React from 'react';
import Tooltip from '~shared/Extensions/Tooltip';
import TokenIcon from '~shared/TokenIcon';
import { Token } from '~types';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { ICON_SIZE } from '../../consts';

const displayName = 'v5.common.CompletedAction.partials.AmountRow';

interface AmountRowProps {
  amount: string;
  token?: Token;
}

const AmountRow = ({ amount, token }: AmountRowProps) => {
  const transformedAmount = moveDecimal(
    amount,
    -getTokenDecimalsWithFallback(token?.decimals),
  );

  return (
    <>
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
        {token && (
          <>
            <TokenIcon token={token} size="xxs" />
            <span className="text-md">{token.symbol}</span>
          </>
        )}
      </div>
    </>
  );
};

AmountRow.displayName = displayName;
export default AmountRow;
