import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';
import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedReleaseStep/partials/MilestoneReleaseModal/types.ts';

export const PaymentBuilderContext = createContext<{
  toggleOnFundingModal: () => void;
  toggleOffFundingModal: () => void;
  isFundingModalOpen: boolean;
  toggleOnMilestoneModal: () => void;
  toggleOffMilestoneModal: () => void;
  isMilestoneModalOpen: boolean;
  toggleOnReleaseModal: () => void;
  toggleOffReleaseModal: () => void;
  isReleaseModalOpen: boolean;
  selectedTransaction: string;
  setSelectedTransaction: (transaction: string) => void;
  selectedMilestones: MilestoneItem[];
  setSelectedMilestones: (transaction: MilestoneItem[]) => void;
}>({
  toggleOnFundingModal: noop,
  toggleOffFundingModal: noop,
  isFundingModalOpen: false,
  toggleOnMilestoneModal: noop,
  toggleOffMilestoneModal: noop,
  isMilestoneModalOpen: false,
  toggleOnReleaseModal: noop,
  toggleOffReleaseModal: noop,
  isReleaseModalOpen: false,
  selectedTransaction: '',
  setSelectedTransaction: noop,
  selectedMilestones: [],
  setSelectedMilestones: noop,
});

export const usePaymentBuilderContext = () => useContext(PaymentBuilderContext);
