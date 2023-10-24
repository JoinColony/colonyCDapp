import { MOTION_BADGE_STATUS } from './consts';

export interface MotionBadgeProps {
  status: keyof typeof MOTION_BADGE_STATUS;
  text?: React.ReactNode;
  iconName?: string;
}
