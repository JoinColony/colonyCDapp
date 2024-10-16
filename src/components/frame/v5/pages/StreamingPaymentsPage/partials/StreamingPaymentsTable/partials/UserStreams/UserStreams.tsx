import Decimal from 'decimal.js';
import React, { useCallback, type FC, useState, useEffect } from 'react';

import { calculateToCurrency } from '~common/Extensions/UserHub/partials/BalanceTab/partials/StreamsInfoRow/utils.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import Numeral from '~shared/Numeral/Numeral.tsx';

export interface UserStreamsItem {
  amount: string;
  tokenAddress: string;
  tokenDecimals: number;
  tokenSymbol: string;
}

interface UserStreamsProps {
  items: UserStreamsItem[];
}

const UserStreams: FC<UserStreamsProps> = ({ items }) => {
  const { currency } = useCurrencyContext();
  const { colony } = useColonyContext();
  const [calculatedAmountPerToken, setCalculatedAmountPerToken] = useState<
    { tokenAddress: string; amount: Decimal | null }[]
  >([]);

  const calculateFunds = useCallback(async () => {
    const accumulatedAmounts: { [tokenAddress: string]: Decimal } = {};

    const calculationPromises = items.map(async ({ amount, tokenAddress }) => {
      const calculatedAmount = await calculateToCurrency({
        amount,
        tokenAddress,
        currency,
        colony,
      });

      if (accumulatedAmounts[tokenAddress]) {
        accumulatedAmounts[tokenAddress] = accumulatedAmounts[
          tokenAddress
        ].plus(calculatedAmount || new Decimal(0));
      } else {
        accumulatedAmounts[tokenAddress] = calculatedAmount || new Decimal(0);
      }
    });

    await Promise.all(calculationPromises);

    const calculatedAmountArray = Object.entries(accumulatedAmounts).map(
      ([tokenAddress, amount]) => ({ tokenAddress, amount }),
    );

    setCalculatedAmountPerToken(calculatedAmountArray);
  }, [colony, currency, items]);

  useEffect(() => {
    calculateFunds();
  }, [calculateFunds]);

  const totalFunds = calculatedAmountPerToken.reduce(
    (acc, { amount }) => acc.plus(amount || 0),
    new Decimal(0),
  );

  return totalFunds ? (
    <Tooltip
      placement="bottom"
      tooltipContent={
        <span>
          {items.map(({ amount, tokenSymbol, tokenDecimals, tokenAddress }) => (
            <span>
              <Numeral value={amount} decimals={tokenDecimals} /> {tokenSymbol}{' '}
              {' /month'} (
              <Numeral
                value={
                  calculatedAmountPerToken.find(
                    (item) => item.tokenAddress === tokenAddress,
                  )?.amount || '0'
                }
              />{' '}
              {currency}
              )
              <br />
            </span>
          ))}
        </span>
      }
    >
      <div className="flex items-center gap-[0.125rem] text-1">
        {currency} <Numeral value={totalFunds} /> {' /month'}
      </div>
    </Tooltip>
  ) : (
    <div className="h-5 w-10 skeleton" />
  );
};

export default UserStreams;
