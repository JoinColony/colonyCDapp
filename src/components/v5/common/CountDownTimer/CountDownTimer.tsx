import clsx from 'clsx';
import React, { FC } from 'react';

import Icon from '~shared/Icon/index.ts';
import { MiniSpinnerLoader } from '~shared/Preloaders/index.ts';
import TimerValue from '~shared/TimerValue/index.ts';

import { CountDownTimerProps } from './types.ts';

const displayName = 'common.CountDownTimer';

const CountDownTimer: FC<CountDownTimerProps> = ({
  countdown,
  isLoading,
  prefix = (
    <Icon
      name="clock"
      className="text-negative-400"
      appearance={{ size: 'tiny' }}
    />
  ),
  className,
  timerClassName,
}) => {
  if (isLoading) {
    return <MiniSpinnerLoader />;
  }

  return (
    <div
      data-test="countDownTimer"
      className={clsx('flex items-center gap-1', className)}
    >
      {prefix}
      <span className={clsx('text-4 text-gray-900', timerClassName)}>
        <TimerValue splitTime={countdown} />
      </span>
    </div>
  );
};

CountDownTimer.displayName = displayName;

export default CountDownTimer;
