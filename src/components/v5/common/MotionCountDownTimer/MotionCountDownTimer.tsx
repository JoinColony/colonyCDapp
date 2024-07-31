import React, { type FC } from 'react';

import CountDownTimer from '~v5/common/CountDownTimer/index.ts';

import { useMotionCountdown } from './hooks.ts';
import { type MotionCountDownTimerProps } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.partials.MotionCountDownTimer';

const MotionCountDownTimer: FC<MotionCountDownTimerProps> = ({
  motionId,
  motionStakes,
  motionState,
  refetchMotionState,
  ...rest
}) => {
  const { countdown, timeLeft, isLoading } = useMotionCountdown({
    state: motionState,
    motionId,
    refetchMotionState,
    motionStakes,
  });

  const loadingState = isLoading || !timeLeft || timeLeft <= 0;

  return (
    <CountDownTimer countdown={countdown} isLoading={loadingState} {...rest} />
  );
};

MotionCountDownTimer.displayName = displayName;

export default MotionCountDownTimer;
