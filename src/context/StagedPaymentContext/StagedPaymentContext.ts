import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';
import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';

export const StagedPaymentContext = createContext<{
  allMilestonesSlotIdsAwaitingRelease: number[];
  currentMilestonesAwaitingRelease: MilestoneItem[];
  setCurrentMilestonesAwaitingRelease: (milestones: MilestoneItem[]) => void;
  isPendingStagesRelease: boolean;
  setPendingState: (isPending: boolean) => void;
  removeSlotIdsFromPending: (slotIds: number[]) => void;
  resetMilestonesState: VoidFunction;
  toggleOnMilestoneModal: VoidFunction;
  toggleOffMilestoneModal: VoidFunction;
  isMilestoneModalOpen: boolean;
}>({
  allMilestonesSlotIdsAwaitingRelease: [],
  currentMilestonesAwaitingRelease: [],
  setCurrentMilestonesAwaitingRelease: noop,
  isPendingStagesRelease: false,
  setPendingState: noop,
  removeSlotIdsFromPending: noop,
  resetMilestonesState: noop,
  toggleOnMilestoneModal: noop,
  toggleOffMilestoneModal: noop,
  isMilestoneModalOpen: false,
});

export const useStagedPaymentContext = () => useContext(StagedPaymentContext);
