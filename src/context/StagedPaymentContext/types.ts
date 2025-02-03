import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';

export interface MilestoneState {
  allMilestonesSlotIdsAwaitingRelease: number[];
  currentMilestonesAwaitingRelease: MilestoneItem[];
  isPendingStagesRelease: boolean;
}
