import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import { type ExpenditureType } from '~gql';
import useToggle from '~hooks/useToggle/index.ts';
import { type ExpenditureStep } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentBuilderWidget/types.ts';
import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';
import { type ReleaseBoxItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/ReleasedBoxItem/ReleasedBoxItem.tsx';

import { PaymentBuilderContext } from './PaymentBuilderContext.ts';

const PaymentBuilderContextProvider: FC<PropsWithChildren> = ({ children }) => {
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
  const [expectedExpenditureType, setExpectedExpenditureType] = useState<
    ExpenditureType | undefined
  >(undefined);
  const [selectedTransaction, setSelectedTransaction] = useState<string>('');
  const [selectedMilestones, setSelectedMilestones] = useState<MilestoneItem[]>(
    [],
  );
  const [selectedMilestoneMotion, setSelectedMilestoneMotion] =
    useState<ReleaseBoxItem | null>(null);
  const [expectedStepKey, setExpectedStepKey] =
    useState<ExpenditureStep | null>(null);

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
      expectedStepKey,
      setExpectedStepKey,
      selectedTransaction,
      setSelectedTransaction,
      selectedMilestones,
      setSelectedMilestones,
      selectedMilestoneMotion,
      setSelectedMilestoneMotion,
    }),
    [
      toggleOnFundingModal,
      toggleOffFundingModal,
      isFundingModalOpen,
      toggleOnMilestoneModal,
      toggleOffMilestoneModal,
      isMilestoneModalOpen,
      toggleOnReleaseModal,
      toggleOffReleaseModal,
      isReleaseModalOpen,
      expectedExpenditureType,
      setExpectedExpenditureType,
      expectedStepKey,
      setExpectedStepKey,
      toggleOnCancelModal,
      toggleOffCancelModal,
      isCancelModalOpen,
      selectedTransaction,
      setSelectedTransaction,
      selectedMilestones,
      setSelectedMilestones,
      selectedMilestoneMotion,
      setSelectedMilestoneMotion,
    ],
  );

  return (
    <PaymentBuilderContext.Provider value={value}>
      {children}
    </PaymentBuilderContext.Provider>
  );
};

export default PaymentBuilderContextProvider;
