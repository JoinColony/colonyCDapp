import { createContext, useContext } from 'react';

import { ExpenditureType } from '~gql';
import { type ExpenditureAction } from '~types/graphql.ts';
import noop from '~utils/noop.ts';
import { type ExpenditureStep } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentBuilderWidget/types.ts';

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
  toggleOnReleaseModal: () => void;
  toggleOffReleaseModal: () => void;
  isReleaseModalOpen: boolean;
  toggleOnFinalizeModal: () => void;
  toggleOffFinalizeModal: () => void;
  isFinalizeModalOpen: boolean;
  selectedFundingAction: ExpenditureAction | null;
  setSelectedFundingAction: (action: ExpenditureAction | null) => void;
  selectedReleaseAction: ExpenditureAction | null;
  setSelectedReleaseAction: (action: ExpenditureAction | null) => void;
  selectedFinalizeAction: ExpenditureAction | null;
  setSelectedFinalizeAction: (action: ExpenditureAction | null) => void;
  selectedEditingAction: ExpenditureAction | null;
  setSelectedEditingAction: (action: ExpenditureAction | null) => void;
  currentStep: ExpenditureStep | string | null;
  setCurrentStep: (key: ExpenditureStep | string | null) => void;
}>({
  toggleOnFundingModal: noop,
  toggleOffFundingModal: noop,
  isFundingModalOpen: false,
  toggleOnCancelModal: noop,
  toggleOffCancelModal: noop,
  isCancelModalOpen: false,
  toggleOnFinalizeModal: noop,
  toggleOffFinalizeModal: noop,
  isFinalizeModalOpen: false,
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
  selectedFinalizeAction: null,
  setSelectedFinalizeAction: noop,
  setSelectedReleaseAction: noop,
  selectedEditingAction: null,
  setSelectedEditingAction: noop,
  currentStep: null,
  setCurrentStep: noop,
});

export const usePaymentBuilderContext = () => useContext(PaymentBuilderContext);
