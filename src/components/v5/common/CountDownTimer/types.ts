import { type TimerValueProps } from '~shared/TimerValue/TimerValue.tsx';

import type React from 'react';

export interface CountDownTimerProps {
  countdown: Exclude<TimerValueProps['splitTime'], undefined>;
  isLoading: boolean;
  className?: string;
  timerClassName?: string;
  prefix?: React.ReactNode;
}
