import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';

export const PaymentBuilderContext = createContext<{
  toggleOnFundingModal: () => void;
  toggleOffFundingModal: () => void;
  isFundingModalOpen: boolean;
  toggleOnReleaseModal: () => void;
  toggleOffReleaseModal: () => void;
  isReleaseModalOpen: boolean;
}>({
  toggleOnFundingModal: noop,
  toggleOffFundingModal: noop,
  isFundingModalOpen: false,
  toggleOnReleaseModal: noop,
  toggleOffReleaseModal: noop,
  isReleaseModalOpen: false,
});

export const usePaymentBuilderContext = () => useContext(PaymentBuilderContext);
