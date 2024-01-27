import { MOTION_BADGE_STATUS } from './consts.ts';

export interface MotionBadgeProps {
  status: keyof typeof MOTION_BADGE_STATUS;
  text?: React.ReactNode;
  iconName?: string;
}
