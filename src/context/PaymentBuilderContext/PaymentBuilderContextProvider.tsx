import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import { type ExpenditureType } from '~gql';
import useToggle from '~hooks/useToggle/index.ts';
import { type ExpenditureAction } from '~types/graphql.ts';
import { type ExpenditureStep } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentBuilderWidget/types.ts';
import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';

import { PaymentBuilderContext } from './PaymentBuilderContext.ts';

const PaymentBuilderContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [expectedStepKey, setExpectedStepKey] =
    useState<ExpenditureStep | null>(null);

  const [
    isFundingModalOpen,
    { toggleOn: toggleOnFundingModal, toggleOff: toggleOffFundingModal },
  ] = useToggle();

  const [
    isCancelModalOpen,
    { toggleOn: toggleOnCancelModal, toggleOff: toggleOffCancelModal },
  ] = useToggle();

  const [
    isReleaseModalOpen,
    { toggleOn: toggleOnReleaseModal, toggleOff: toggleOffReleaseModal },
  ] = useToggle();

  const [
    isMilestoneModalOpen,
    { toggleOn: toggleOnMilestoneModal, toggleOff: toggleOffMilestoneModal },
  ] = useToggle();

  const [selectedFundingAction, setSelectedFundingAction] =
    useState<ExpenditureAction | null>(null);
  const [selectedReleaseAction, setSelectedReleaseAction] =
    useState<ExpenditureAction | null>(null);

  const [expectedExpenditureType, setExpectedExpenditureType] = useState<
    ExpenditureType | undefined
  >(undefined);

  const [selectedMilestones, setSelectedMilestones] = useState<MilestoneItem[]>(
    [],
  );
  const [selectedEditingAction, setSelectedEditingAction] =
    useState<ExpenditureAction | null>(null);
  const [currentStep, setCurrentStep] = useState<
    ExpenditureStep | string | null
  >(null);

  const value = useMemo(
    () => ({
      toggleOnFundingModal,
      toggleOffFundingModal,
      isFundingModalOpen,
      toggleOnCancelModal,
      toggleOffCancelModal,
      isCancelModalOpen,
      toggleOnMilestoneModal,
      toggleOffMilestoneModal,
      isMilestoneModalOpen,
      toggleOnReleaseModal,
      toggleOffReleaseModal,
      expectedExpenditureType,
      setExpectedExpenditureType,
      isReleaseModalOpen,
      selectedExpenditureAction: null,
      setSelectedExpenditureAction: () => {},
      selectedExpenditureMotion: null,
      expectedStepKey,
      setExpectedStepKey,
      selectedMilestones,
      setSelectedMilestones,
      selectedEditingAction,
      setSelectedEditingAction,
      currentStep,
      setCurrentStep,
      selectedFundingAction,
      setSelectedFundingAction,
      selectedReleaseAction,
      setSelectedReleaseAction,
    }),
    [
      toggleOnFundingModal,
      toggleOffFundingModal,
      isFundingModalOpen,
      toggleOnCancelModal,
      toggleOffCancelModal,
      isCancelModalOpen,
      toggleOnMilestoneModal,
      toggleOffMilestoneModal,
      isMilestoneModalOpen,
      toggleOnReleaseModal,
      toggleOffReleaseModal,
      expectedExpenditureType,
      isReleaseModalOpen,
      expectedStepKey,
      selectedMilestones,
      setSelectedMilestones,
      selectedEditingAction,
      setSelectedEditingAction,
      currentStep,
      setCurrentStep,
      selectedFundingAction,
      setSelectedFundingAction,
      selectedReleaseAction,
      setSelectedReleaseAction,
    ],
  );

  return (
    <PaymentBuilderContext.Provider value={value}>
      {children}
    </PaymentBuilderContext.Provider>
  );
};

export default PaymentBuilderContextProvider;
