import { Coins } from 'phosphor-react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import TokenIcon from '~shared/TokenIcon/index.ts';
import { type Token } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';
import { getFormattedTokenAmount } from '../utils.ts';

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
