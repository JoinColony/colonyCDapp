import { type MotionState } from '~utils/colonyMotions.ts';

export interface ActionBadgeProps {
  motionState: MotionState | undefined;
  loading?: boolean;
  expenditureId?: string;
  className?: string;
}
