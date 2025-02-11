import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import Decimal from 'decimal.js';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, type FC, useState } from 'react';

import Numeral from '~shared/Numeral/Numeral.tsx';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';

import { type AvailableToClaimCounterProps } from './types.ts';

const displayName =
  'v5.common.CompletedAction.partials.StreamingPayment.partials.AvailableToClaimCounter';

const AvailableToClaimCounter: FC<AvailableToClaimCounterProps> = ({
  hasEnoughFunds,
  status,
  amountAvailableToClaim,
  decimals,
  tokenSymbol,
  getAmounts,
  ratePerSecond,
  currentTime: currentTimeProp,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(-1);

  useEffect(() => {
    const timer = setInterval(() => {
      if (
        [
          StreamingPaymentStatus.Active,
          StreamingPaymentStatus.NotStarted,
        ].includes(status)
      ) {
        getAmounts(currentTime);
        setCurrentTime((oldTime) => oldTime + 1);
      }
    }, 1000);

    if (
      ![
        StreamingPaymentStatus.Active,
        StreamingPaymentStatus.NotStarted,
      ].includes(status)
    ) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [currentTime, getAmounts, status]);

  useEffect(() => {
    setCurrentTime(currentTimeProp);
  }, [currentTimeProp]);

  const formattedRate = new Decimal(ratePerSecond)
    .div(10 ** decimals)
    .toString();

  const decimalPlaces = formattedRate.toString().split('.')[1]?.length || 0;
  const fixedDecimalPlaces = decimalPlaces < 5 ? decimalPlaces : 5;

  const formattedNumber = new Decimal(amountAvailableToClaim)
    .div(10 ** decimals)
    .toFixed(fixedDecimalPlaces)
    .toString();

  const digits = formattedNumber.split('').map((char, index) => ({
    char,
    key: `${char}-${index}`,
    isStatic: char === ',' || char === '.', // Handle commas as static
  }));

  return status === StreamingPaymentStatus.Active ? (
    <span
      className={clsx('flex items-center justify-end gap-1', {
        'text-gray-900': hasEnoughFunds,
        'font-medium text-negative-400': !hasEnoughFunds,
      })}
    >
      <span className="inline-flex gap-[0.5ch]">
        <div className="flex items-center justify-center overflow-hidden text-sm">
          {digits.map(({ char, key, isStatic }) => (
            <div
              key={key}
              className="relative inline-block w-[1ch] overflow-hidden"
            >
              {isStatic ? (
                <div className="flex w-full items-center justify-center leading-[2ch]">
                  {char}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={char}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="flex w-full items-center justify-center leading-[2ch]"
                  >
                    {char}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>
        <span>{tokenSymbol}</span>
      </span>
      {!hasEnoughFunds && <WarningCircle size={16} className="fill-current" />}
    </span>
  ) : (
    <Numeral
      value={amountAvailableToClaim}
      decimals={decimals}
      suffix={` ${tokenSymbol}`}
      className={clsx('text-sm', {
        'text-gray-900': hasEnoughFunds,
        'font-medium text-negative-400': !hasEnoughFunds,
      })}
    />
  );
};

AvailableToClaimCounter.displayName = displayName;
export default AvailableToClaimCounter;
