import { type ColonyMotion } from '~types/graphql.ts';

export interface MotionOutcomeBadgeProps {
  motionData?: ColonyMotion | null;
  motionState?: number;
}
