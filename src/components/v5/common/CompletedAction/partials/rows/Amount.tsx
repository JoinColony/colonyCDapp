import { Coins } from '@phosphor-icons/react';
import React from 'react';

import TokenIcon from '~shared/TokenIcon/index.ts';
import { type Token } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import { getFormattedTokenAmount } from '../utils.ts';

import ActionData from './ActionData.tsx';

const displayName = 'v5.common.CompletedAction.partials.AmountRow';

interface AmountRowProps {
  amount: string;
  token?: Token;
}

const AmountRow = ({ amount, token }: AmountRowProps) => {
  const formattedAmount = getFormattedTokenAmount(amount, token?.decimals);

  return (
    <ActionData
      rowLabel={formatText({ id: 'actionSidebar.amount' })}
      tooltipContent={formatText({
        id: 'actionSidebar.tooltip.simplePayment.amount',
      })}
      RowIcon={Coins}
      rowContent={
        <div className="flex items-center gap-1">
          {formattedAmount}
          {token && (
            <>
              <TokenIcon token={token} size="xxs" />
              <span className="text-md">{token.symbol}</span>
            </>
          )}
        </div>
      }
    />
  );
};

AmountRow.displayName = displayName;
export default AmountRow;
