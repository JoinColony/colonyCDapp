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
    isFinalizeModalOpen,
    { toggleOn: toggleOnFinalizeModal, toggleOff: toggleOffFinalizeModal },
  ] = useToggle();

  const [selectedFundingAction, setSelectedFundingAction] =
    useState<ExpenditureAction | null>(null);
  const [selectedFinalizeAction, setSelectedFinalizeAction] =
    useState<ExpenditureAction | null>(null);
  const [selectedReleaseAction, setSelectedReleaseAction] =
    useState<ExpenditureAction | null>(null);

  const [expectedExpenditureType, setExpectedExpenditureType] = useState<
    ExpenditureType | undefined
  >(undefined);

  const value = useMemo(
    () => ({
      toggleOnFundingModal,
      toggleOffFundingModal,
      isFundingModalOpen,
      toggleOnCancelModal,
      toggleOffCancelModal,
      isCancelModalOpen,
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
      selectedFundingAction,
      setSelectedFundingAction,
      selectedReleaseAction,
      setSelectedReleaseAction,
      isFinalizeModalOpen,
      toggleOnFinalizeModal,
      toggleOffFinalizeModal,
      selectedFinalizeAction,
      setSelectedFinalizeAction,
    }),
    [
      toggleOnFundingModal,
      toggleOffFundingModal,
      isFundingModalOpen,
      toggleOnCancelModal,
      toggleOffCancelModal,
      isCancelModalOpen,
      toggleOnReleaseModal,
      toggleOffReleaseModal,
      expectedExpenditureType,
      isReleaseModalOpen,
      expectedStepKey,
      selectedFundingAction,
      selectedReleaseAction,
      setSelectedReleaseAction,
      isFinalizeModalOpen,
      toggleOnFinalizeModal,
      toggleOffFinalizeModal,
      selectedFinalizeAction,
      setSelectedFinalizeAction,
    ],
  );

  return (
    <PaymentBuilderContext.Provider value={value}>
      {children}
    </PaymentBuilderContext.Provider>
  );
};

export default PaymentBuilderContextProvider;
