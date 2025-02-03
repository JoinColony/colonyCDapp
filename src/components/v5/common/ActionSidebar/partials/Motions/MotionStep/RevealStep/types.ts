import { type ICompletedMotionAction } from '~v5/common/ActionSidebar/partials/Motions/types.ts';

export interface RevealStepProps
  extends Pick<ICompletedMotionAction, 'action'> {
  motionState?: number;
}
