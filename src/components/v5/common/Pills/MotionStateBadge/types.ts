import { type MotionState } from '~utils/colonyMotions.ts';

import { type PillsProps } from '../types.ts';

export interface MotionStateBadgeProps extends PillsProps {
  state: MotionState | 'Unknown';
}
