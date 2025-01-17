import { Coins, type Icon } from '@phosphor-icons/react';
import React from 'react';

import { type Token } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { getNumeralTokenAmount } from '~utils/tokens.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import ActionData from './ActionData.tsx';

const displayName = 'v5.common.CompletedAction.partials.AmountRow';

interface AmountRowProps {
  amount: string;
  token?: Token;
  rowLabel?: string;
  tooltipContent?: string;
  RowIcon?: Icon;
}

const AmountRow = ({
  amount,
  token,
  rowLabel,
  tooltipContent,
  RowIcon,
}: AmountRowProps) => {
  const formattedAmount = getNumeralTokenAmount(amount, token?.decimals);

  return (
    <ActionData
      rowLabel={rowLabel || formatText({ id: 'actionSidebar.amount' })}
      tooltipContent={
        tooltipContent ||
        formatText({
          id: 'actionSidebar.tooltip.simplePayment.amount',
        })
      }
      RowIcon={RowIcon || Coins}
      rowContent={
        <div className="flex items-center gap-3">
          {formattedAmount}
          {token && (
            <div className="flex gap-1">
              <TokenAvatar
                size={18}
                tokenName={token.name}
                tokenAddress={token.tokenAddress}
                tokenAvatarSrc={token.avatar ?? undefined}
              />
              <span className="text-md">{token.symbol}</span>
            </div>
          )}
        </div>
      }
    />
  );
};

AmountRow.displayName = displayName;
export default AmountRow;
