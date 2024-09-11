import { createContext, useContext } from 'react';

import { ExpenditureType } from '~gql';
import { type ExpenditureAction } from '~types/graphql.ts';
import noop from '~utils/noop.ts';
import { type ExpenditureStep } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentBuilderWidget/types.ts';
import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';
import { type ReleaseBoxItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/ReleasedBoxItem/ReleasedBoxItem.tsx';

export const PaymentBuilderContext = createContext<{
  toggleOnFundingModal: () => void;
  toggleOffFundingModal: () => void;
  isFundingModalOpen: boolean;
  toggleOnCancelModal: () => void;
  toggleOffCancelModal: () => void;
  isCancelModalOpen: boolean;
  toggleOnMilestoneModal: () => void;
  toggleOffMilestoneModal: () => void;
  isMilestoneModalOpen: boolean;
  toggleOnReleaseModal: () => void;
  toggleOffReleaseModal: () => void;
  isReleaseModalOpen: boolean;
  expectedExpenditureType: ExpenditureType | undefined;
  setExpectedExpenditureType: (type: ExpenditureType | undefined) => void;
  expectedStepKey: ExpenditureStep | null;
  setExpectedStepKey: (step: ExpenditureStep | null) => void;
  selectedTransaction: string;
  setSelectedTransaction: (transaction: string) => void;
  selectedMilestoneMotion: ReleaseBoxItem | null;
  setSelectedMilestoneMotion: (transaction: ReleaseBoxItem | null) => void;
  selectedMilestones: MilestoneItem[];
  setSelectedMilestones: (transaction: MilestoneItem[]) => void;
  selectedEditingAction: ExpenditureAction | null;
  setSelectedEditingAction: (action: ExpenditureAction | null) => void;
  currentStep: ExpenditureStep | string | null;
  setCurrentStep: (key: ExpenditureStep | string | null) => void;
  selectedFundingAction: ExpenditureAction | null;
  setSelectedFundingAction: (action: ExpenditureAction | null) => void;
}>({
  toggleOnFundingModal: noop,
  toggleOffFundingModal: noop,
  isFundingModalOpen: false,
  toggleOnCancelModal: noop,
  toggleOffCancelModal: noop,
  isCancelModalOpen: false,
  toggleOnMilestoneModal: noop,
  toggleOffMilestoneModal: noop,
  isMilestoneModalOpen: false,
  toggleOnReleaseModal: noop,
  toggleOffReleaseModal: noop,
  expectedExpenditureType: ExpenditureType.PaymentBuilder,
  setExpectedExpenditureType: noop,
  expectedStepKey: null,
  setExpectedStepKey: noop,
  isReleaseModalOpen: false,
  selectedTransaction: '',
  setSelectedTransaction: noop,
  selectedMilestoneMotion: null,
  setSelectedMilestoneMotion: noop,
  selectedMilestones: [],
  setSelectedMilestones: noop,
  selectedEditingAction: null,
  setSelectedEditingAction: noop,
  currentStep: null,
  setCurrentStep: noop,
  selectedFundingAction: null,
  setSelectedFundingAction: noop,
});

export const usePaymentBuilderContext = () => useContext(PaymentBuilderContext);
