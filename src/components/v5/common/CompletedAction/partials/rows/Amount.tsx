import { Coins } from 'phosphor-react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip';
import TokenIcon from '~shared/TokenIcon';
import { Token } from '~types/graphql';
import { formatText } from '~utils/intl';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts';
import { getFormattedTokenAmount } from '../utils';

const displayName = 'v5.common.CompletedAction.partials.AmountRow';

interface AmountRowProps {
  amount: string;
  token?: Token;
}

const AmountRow = ({ amount, token }: AmountRowProps) => {
  const formattedAmount = getFormattedTokenAmount(amount, token?.decimals);

  return (
    <>
      <div>
        <Tooltip
          placement={DEFAULT_TOOLTIP_POSITION}
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
        {formattedAmount}
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
