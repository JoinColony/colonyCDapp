import { type SetStateFn } from '~types/index.ts';
import { type ICompletedMotionAction } from '~v5/common/ActionSidebar/partials/Motions/types.ts';

export interface MotionContextValues extends ICompletedMotionAction {
  isRefetching: boolean;
  setIsRefetching: SetStateFn;
}
