import { MotionState } from '~utils/colonyMotions.ts';

import { PillsProps } from '../types.ts';

export interface MotionStateBadgeProps extends PillsProps {
  state: MotionState;
}
