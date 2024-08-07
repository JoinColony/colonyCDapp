import { createContext, useContext } from 'react';

import { ExpenditureType } from '~gql';
import noop from '~utils/noop.ts';
import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';
import { type ReleaseBoxItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/ReleasedBoxItem/ReleasedBoxItem.tsx';

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
  expectedExpenditureType: ExpenditureType | undefined;
  setExpectedExpenditureType: (type: ExpenditureType | undefined) => void;
  selectedTransaction: string;
  setSelectedTransaction: (transaction: string) => void;
  selectedMilestoneMotion: ReleaseBoxItem | null;
  setSelectedMilestoneMotion: (transaction: ReleaseBoxItem) => void;
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
  expectedExpenditureType: ExpenditureType.PaymentBuilder,
  setExpectedExpenditureType: noop,
  isReleaseModalOpen: false,
  selectedTransaction: '',
  setSelectedTransaction: noop,
  selectedMilestoneMotion: null,
  setSelectedMilestoneMotion: noop,
  selectedMilestones: [],
  setSelectedMilestones: noop,
});

export const usePaymentBuilderContext = () => useContext(PaymentBuilderContext);
