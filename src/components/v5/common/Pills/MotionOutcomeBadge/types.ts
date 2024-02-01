export type MotionOutcome = 'support' | 'oppose';

export interface MotionOutcomeBadgeProps {
  outcome: MotionOutcome;
  text?: React.ReactNode;
  iconName?: string;
}
