import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';

export const PaymentBuilderContext = createContext<{
  toggleOnFundingModal: () => void;
  toggleOffFundingModal: () => void;
  isFundingModalOpen: boolean;
  toggleOnReleaseModal: () => void;
  toggleOffReleaseModal: () => void;
  isReleaseModalOpen: boolean;
  selectedTransaction: string;
  setSelectedTransaction: (transaction: string) => void;
}>({
  toggleOnFundingModal: noop,
  toggleOffFundingModal: noop,
  isFundingModalOpen: false,
  toggleOnReleaseModal: noop,
  toggleOffReleaseModal: noop,
  isReleaseModalOpen: false,
  selectedTransaction: '',
  setSelectedTransaction: noop,
});

export const usePaymentBuilderContext = () => useContext(PaymentBuilderContext);
