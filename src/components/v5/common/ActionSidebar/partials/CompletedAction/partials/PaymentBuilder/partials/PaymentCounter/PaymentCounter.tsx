import { BigNumber } from 'ethers';
import React, { type FC, useEffect, useState } from 'react';

import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import TimerValue from '~shared/TimerValue/TimerValue.tsx';
import { splitTimeLeft } from '~v5/common/MotionCountDownTimer/helpers.ts';

import { type PaymentCounterProps } from './types.ts';

const PaymentCounter: FC<PaymentCounterProps> = ({
  claimDelay,
  finalizedTimestamp,
  showSingleValue,
  onTimeEnd,
}) => {
  const { currentBlockTime: blockTime } = useCurrentBlockTime();
  const secondsToNextPayment =
    blockTime && claimDelay
      ? BigNumber.from(finalizedTimestamp)
          .add(claimDelay)
          .sub(blockTime)
          .toNumber()
      : 0;

  const [timeLeft, setTimeLeft] = useState<number>(-1);

  useEffect(() => {
    setTimeLeft(secondsToNextPayment > 0 ? secondsToNextPayment : -1);
  }, [secondsToNextPayment]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft) {
        setTimeLeft((oldTimeLeft) => oldTimeLeft - 1);
      }
    }, 1000);

    if (timeLeft === 0) {
      onTimeEnd?.();
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const splitTime = splitTimeLeft(timeLeft);

  return <TimerValue splitTime={splitTime} showSingleValue={showSingleValue} />;
};

export default PaymentCounter;
