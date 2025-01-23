import { Clock } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { MiniSpinnerLoader } from '~shared/Preloaders/index.ts';
import TimerValue from '~shared/TimerValue/index.ts';

import { type CountDownTimerProps } from './types.ts';

const displayName = 'common.CountDownTimer';

const CountDownTimer: FC<CountDownTimerProps> = ({
  countdown,
  isLoading,
  prefix = <Clock size={14} className="text-negative-400" />,
  className,
  timerClassName,
}) => {
  if (isLoading) {
    return <MiniSpinnerLoader />;
  }

  return (
    <div
      data-test="countDownTimer"
      data-testid="countDownTimer"
      className={clsx('flex items-center gap-1', className)}
    >
      {prefix}
      <span className={clsx('text-gray-900 text-4', timerClassName)}>
        <TimerValue splitTime={countdown} />
      </span>
    </div>
  );
};

CountDownTimer.displayName = displayName;

export default CountDownTimer;
