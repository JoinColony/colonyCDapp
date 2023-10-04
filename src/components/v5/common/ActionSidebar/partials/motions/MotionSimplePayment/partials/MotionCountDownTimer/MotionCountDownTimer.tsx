import React, { FC } from 'react';
import CountDownTimer from '~v5/common/CountDownTimer';
import { useMotionCountdown } from '../../helpers';
import { MotionCountDownTimerProps } from './types';

const MotionCountDownTimer: FC<MotionCountDownTimerProps> = ({
  motionId,
  motionStakes,
  motionState,
  refetchMotionState,
}) => {
  const { countdown, loadingCountdown } = useMotionCountdown(
    motionState,
    motionId,
    refetchMotionState,
    motionStakes,
  );

  return (
    <CountDownTimer countdown={countdown} loadingCountdown={loadingCountdown} />
  );
};

export default MotionCountDownTimer;
