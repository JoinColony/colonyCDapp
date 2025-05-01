import { type ColonyActionFragment } from '~gql';
import { type MotionState } from '~utils/colonyMotions.ts';
import { type RefetchAction } from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';

export interface FinalizeStepProps {
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
  refetchAction: RefetchAction;
  actionData: ColonyActionFragment;
  motionState?: MotionState;
}

export enum FinalizeStepSections {
  Finalize = 'finalizeStep',
}

export enum WinningsItems {
  Staked = 'staked',
  Winnings = 'winnings',
  Total = 'total',
  Completed = 'completed',
}
