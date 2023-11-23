import { MotionState } from '~utils/colonyMotions';

import { PillsProps } from '../types';

export interface MotionStateBadgeProps extends PillsProps {
  state: MotionState;
}
