import React, { useCallback, type FC, useState, useEffect } from 'react';

import { calculateToCurrency } from '~common/Extensions/UserHub/partials/BalanceTab/partials/StreamsInfoRow/utils.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import type Decimal from 'decimal.js';

interface UserStreamsProps {
  amount: string;
  tokenAddress: string;
  tokenDecimals: number;
}

const UserStreams: FC<UserStreamsProps> = ({
  amount,
  tokenAddress,
  tokenDecimals,
}) => {
  const { currency } = useCurrencyContext();
  const { colony } = useColonyContext();
  const [totalFunds, setTotalFunds] = useState<Decimal | null>(null);

  const getTotalFunds = useCallback(async () => {
    const calculatedAmount = await calculateToCurrency({
      amount,
      tokenAddress,
      currency,
      colony,
    });

    setTotalFunds(calculatedAmount);
  }, [amount, colony, currency, tokenAddress]);

  useEffect(() => {
    getTotalFunds();
  }, [getTotalFunds]);

  const formattedValue = convertToDecimal(
    totalFunds || '',
    getTokenDecimalsWithFallback(tokenDecimals),
  );

  return formattedValue ? (
    <div className="flex items-center gap-[0.125rem] text-1">
      {currency} <Numeral value={formattedValue} decimals={-tokenDecimals} />{' '}
      {' /month'}
    </div>
  ) : (
    <div className="h-5 w-10 skeleton" />
  );
};

export default UserStreams;
