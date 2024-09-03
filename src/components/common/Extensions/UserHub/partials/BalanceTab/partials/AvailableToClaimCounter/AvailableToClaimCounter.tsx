import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC, useEffect } from 'react';

import { currencySymbolMap } from '~constants/currency.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';

import { type AvailableToClaimCounterProps } from './types.ts';

const AvailableToClaimCounter: FC<AvailableToClaimCounterProps> = ({
  amountAvailableToClaim,
  getTotalFunds,
  isAtLeastOnePaymentActive,
  ratePerSecond,
}) => {
  const { currency } = useCurrencyContext();

  useEffect(() => {
    const timer = setInterval(() => {
      getTotalFunds();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [getTotalFunds]);

  const decimalPlaces = ratePerSecond.toString().split('.')[1]?.length || 0;
  const fixedDecimalPlaces = decimalPlaces < 5 ? decimalPlaces : 5;

  const formattedNumber = Number(
    amountAvailableToClaim.toFixed(fixedDecimalPlaces),
  ).toLocaleString(undefined, {
    minimumFractionDigits: fixedDecimalPlaces,
    maximumFractionDigits: fixedDecimalPlaces,
  });

  const digits = formattedNumber.split('').map((char, index) => ({
    char,
    key: `${char}-${index}`,
    isStatic: char === ',' || char === '.', // Handle commas as static
  }));

  return isAtLeastOnePaymentActive ? (
    <div className="flex items-center justify-end gap-[0.5ch]">
      <span>{currencySymbolMap[currency]}</span>
      <div className="flex items-center justify-center overflow-hidden">
        {digits.map(({ char, key, isStatic }) => (
          <div
            key={key}
            className={clsx('relative inline-block overflow-hidden', {
              'w-[1ch]': !isStatic,
            })}
          >
            {isStatic ? (
              <div className="flex w-full items-center justify-center">
                {char}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={char}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  className="flex w-full items-center justify-center"
                >
                  {char}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>
      <span>{currency}</span>
    </div>
  ) : (
    <span>
      {currencySymbolMap[currency]} {formattedNumber} {currency}
    </span>
  );
};

export default AvailableToClaimCounter;
