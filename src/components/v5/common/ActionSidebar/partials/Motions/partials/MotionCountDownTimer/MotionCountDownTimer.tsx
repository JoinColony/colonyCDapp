import React, { FC } from 'react';
import CountDownTimer from '~v5/common/CountDownTimer';
import { useMotionCountdown } from './hooks';
import { MotionCountDownTimerProps } from './types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.partials.MotionCountDownTimer';

const MotionCountDownTimer: FC<MotionCountDownTimerProps> = ({
  motionId,
  motionStakes,
  motionState,
  refetchMotionState,
}) => {
  const { countdown, isLoading } = useMotionCountdown(
    motionState,
    motionId,
    refetchMotionState,
    motionStakes,
  );

  return <CountDownTimer countdown={countdown} isLoading={isLoading} />;
};

MotionCountDownTimer.displayName = displayName;

export default MotionCountDownTimer;
