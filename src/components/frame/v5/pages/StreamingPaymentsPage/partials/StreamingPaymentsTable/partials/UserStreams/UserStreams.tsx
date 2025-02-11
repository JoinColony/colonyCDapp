import Decimal from 'decimal.js';
import React, {
  useCallback,
  type FC,
  useState,
  useEffect,
  useMemo,
} from 'react';

import { calculateToCurrency } from '~common/Extensions/UserHub/partials/BalanceTab/partials/StreamsInfoRow/utils.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { type StreamingActionTableFieldModel } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/types.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { NumeralCurrency } from '~shared/Numeral/NumeralCurrency.tsx';
import { calculateTotalsFromStreams } from '~shared/StreamingPayments/utils.ts';

export interface UserStreamsItem {
  amount: string;
  tokenDecimals: number;
  tokenSymbol: string;
}

interface UserStreamsProps {
  items: {
    [tokenAddress: string]: UserStreamsItem;
  };
  actions: StreamingActionTableFieldModel[];
  toggleExpanded: (expanded?: boolean | undefined) => void;
}

const UserStreams: FC<UserStreamsProps> = ({
  items,
  actions,
  toggleExpanded,
}) => {
  const { currency } = useCurrencyContext();
  const { colony } = useColonyContext();
  const [calculatedAmountPerToken, setCalculatedAmountPerToken] = useState<{
    [tokenAddress: string]: Decimal;
  }>({});
  const [lastMonthStreamed, setLastMonthStreamed] = useState(0);

  const tokenTotals = useMemo(
    () =>
      Object.entries(items).map(([tokenAddress, item]) => ({
        ...item,
        tokenAddress,
      })),
    [items],
  );
  const { currentBlockTime: blockTime } = useCurrentBlockTime();

  const calculateFunds = useCallback(async () => {
    const accumulatedAmounts: { [tokenAddress: string]: Decimal } = {};

    const calculationPromises = tokenTotals.map(
      async ({ amount, tokenAddress }) => {
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
      },
    );

    await Promise.all(calculationPromises);

    setCalculatedAmountPerToken(accumulatedAmounts);
  }, [colony, currency, tokenTotals]);

  const getTotalFunds = useCallback(async () => {
    const { lastMonthStreaming } = await calculateTotalsFromStreams({
      streamingPayments: actions,
      currentTimestamp: Math.floor(blockTime ?? Date.now() / 1000),
      currency,
      colony,
    });
    setLastMonthStreamed(lastMonthStreaming);
  }, [actions, blockTime, currency, colony]);

  useEffect(() => {
    calculateFunds();
  }, [calculateFunds]);

  useEffect(() => {
    getTotalFunds();
  }, [getTotalFunds]);

  const calculatedAmountArray = Object.entries(calculatedAmountPerToken).map(
    ([tokenAddress, amount]) => ({ tokenAddress, amount }),
  );

  const totalFunds = calculatedAmountArray.reduce(
    (acc, { amount }) => acc.plus(amount || 0),
    new Decimal(0),
  );
  const shouldShowTooltip = calculatedAmountArray.length > 0;
  const content = (
    <div className="flex w-full items-center justify-end gap-[0.125rem] text-1">
      <NumeralCurrency value={lastMonthStreamed} />
      {currency} {' /month'}
    </div>
  );

  return totalFunds ? (
    <>
      {shouldShowTooltip ? (
        <button
          type="button"
          onClick={() => toggleExpanded()}
          className="h-full w-full pr-4"
        >
          <Tooltip
            placement="bottom"
            tooltipContent={
              <div className="flex flex-col items-start">
                <span>Includes:</span>
                <span>
                  {tokenTotals.map(
                    ({ amount, tokenSymbol, tokenDecimals, tokenAddress }) => (
                      <span key={tokenSymbol}>
                        <Numeral value={amount} decimals={tokenDecimals} />{' '}
                        {tokenSymbol} {' /month'} (
                        <NumeralCurrency
                          value={calculatedAmountPerToken[tokenAddress] || '0'}
                        />{' '}
                        {currency}
                        )
                        <br />
                      </span>
                    ),
                  )}
                </span>
              </div>
            }
          >
            {content}
          </Tooltip>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => toggleExpanded()}
          className="h-full w-full pr-4"
        >
          {content}
        </button>
      )}
    </>
  ) : (
    <div className="h-5 w-10 skeleton" />
  );
};

export default UserStreams;
