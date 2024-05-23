import React, { type FC, type PropsWithChildren, useMemo } from 'react';

import useToggle from '~hooks/useToggle/index.ts';

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

  const value = useMemo(
    () => ({
      toggleOnFundingModal,
      toggleOffFundingModal,
      isFundingModalOpen,
      toggleOnReleaseModal,
      toggleOffReleaseModal,
      isReleaseModalOpen,
    }),
    [
      toggleOnFundingModal,
      toggleOffFundingModal,
      isFundingModalOpen,
      toggleOnReleaseModal,
      toggleOffReleaseModal,
      isReleaseModalOpen,
    ],
  );

  return (
    <PaymentBuilderContext.Provider value={value}>
      {children}
    </PaymentBuilderContext.Provider>
  );
};

export default PaymentBuilderContextProvider;
