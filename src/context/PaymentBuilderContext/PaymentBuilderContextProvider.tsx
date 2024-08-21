import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import useToggle from '~hooks/useToggle/index.ts';
import { type ExpenditureAction } from '~types/graphql.ts';

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
  const [selectedFundingAction, setSelectedFundingAction] =
    useState<ExpenditureAction | null>(null);

  const value = useMemo(
    () => ({
      toggleOnFundingModal,
      toggleOffFundingModal,
      isFundingModalOpen,
      toggleOnReleaseModal,
      toggleOffReleaseModal,
      isReleaseModalOpen,
      selectedFundingAction,
      setSelectedFundingAction,
    }),
    [
      toggleOnFundingModal,
      toggleOffFundingModal,
      isFundingModalOpen,
      toggleOnReleaseModal,
      toggleOffReleaseModal,
      isReleaseModalOpen,
      selectedFundingAction,
    ],
  );

  return (
    <PaymentBuilderContext.Provider value={value}>
      {children}
    </PaymentBuilderContext.Provider>
  );
};

export default PaymentBuilderContextProvider;
