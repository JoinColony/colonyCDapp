import React from 'react';

import { TimerValueProps } from '~shared/TimerValue/TimerValue';

export interface CountDownTimerProps {
  countdown: Exclude<TimerValueProps['splitTime'], undefined>;
  isLoading: boolean;
  className?: string;
  timerClassName?: string;
  prefix?: React.ReactNode;
}
