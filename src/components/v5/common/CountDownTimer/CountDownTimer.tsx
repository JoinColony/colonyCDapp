import React, { FC } from 'react';
import Icon from '~shared/Icon';

import { MiniSpinnerLoader } from '~shared/Preloaders';
import TimerValue from '~shared/TimerValue';

import { CountDownTimerProps } from './types';

const displayName = 'common.CountDownTimer';

const CountDownTimer: FC<CountDownTimerProps> = ({ countdown, isLoading }) => {
  if (isLoading) {
    return <MiniSpinnerLoader />;
  }

  return (
    <div data-test="countDownTimer" className="flex items-center gap-1">
      <Icon
        name="clock"
        className="text-negative-400 [&_svg]:h-[1em] [&_svg]:w-[1em] [&_svg]:text-[.875rem]"
      />
      <span className="text-4 text-gray-900">
        <TimerValue splitTime={countdown} />
      </span>
    </div>
  );
};

CountDownTimer.displayName = displayName;

export default CountDownTimer;
