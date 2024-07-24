import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import useToggle from '~hooks/useToggle/index.ts';
import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';

import { PaymentBuilderContext } from './PaymentBuilderContext.ts';

const PaymentBuilderContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [
    isFundingModalOpen,
    { toggleOn: toggleOnFundingModal, toggleOff: toggleOffFundingModal },
  ] = useToggle();
  const [
    isReleaseModalOpen,
    { toggleOn: toggleOnReleaseModal, toggleOff: toggleOffReleaseModal },
  ] = useToggle();
  const [
    isMilestoneModalOpen,
    { toggleOn: toggleOnMilestoneModal, toggleOff: toggleOffMilestoneModal },
  ] = useToggle();
  const [selectedTransaction, setSelectedTransaction] = useState<string>('');
  const [selectedMilestones, setSelectedMilestones] = useState<MilestoneItem[]>(
    [],
  );

  const value = useMemo(
    () => ({
      toggleOnFundingModal,
      toggleOffFundingModal,
      isFundingModalOpen,
      toggleOnMilestoneModal,
      toggleOffMilestoneModal,
      isMilestoneModalOpen,
      toggleOnReleaseModal,
      toggleOffReleaseModal,
      isReleaseModalOpen,
      selectedTransaction,
      setSelectedTransaction,
      selectedMilestones,
      setSelectedMilestones,
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
      selectedTransaction,
      setSelectedTransaction,
      selectedMilestones,
      setSelectedMilestones,
    ],
  );

  return (
    <PaymentBuilderContext.Provider value={value}>
      {children}
    </PaymentBuilderContext.Provider>
  );
};

export default PaymentBuilderContextProvider;
