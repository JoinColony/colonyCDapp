import { createContext, useContext } from 'react';

import { ExpenditureType } from '~gql';
import { type ExpenditureAction } from '~types/graphql.ts';
import noop from '~utils/noop.ts';
import { type ExpenditureStep } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentBuilderWidget/types.ts';
import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';

export const PaymentBuilderContext = createContext<{
  expectedExpenditureType: ExpenditureType | undefined;
  setExpectedExpenditureType: (type: ExpenditureType | undefined) => void;
  expectedStepKey: ExpenditureStep | null;
  setExpectedStepKey: (step: ExpenditureStep | null) => void;
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
  selectedFundingAction: ExpenditureAction | null;
  selectedReleaseAction: ExpenditureAction | null;
  setSelectedFundingAction: (action: ExpenditureAction | null) => void;
  setSelectedReleaseAction: (action: ExpenditureAction | null) => void;
  selectedMilestones: MilestoneItem[];
  setSelectedMilestones: (transaction: MilestoneItem[]) => void;
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
  selectedFundingAction: null,
  selectedReleaseAction: null,
  setSelectedFundingAction: noop,
  setSelectedReleaseAction: noop,
  selectedMilestones: [],
  setSelectedMilestones: noop,
});

export const usePaymentBuilderContext = () => useContext(PaymentBuilderContext);
