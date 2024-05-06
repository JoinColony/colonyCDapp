import { type MotionState } from '~utils/colonyMotions.ts';

export interface RequestBoxItemProps {
  date: string;
  motionState: MotionState;
  transactionHash: string;
}
