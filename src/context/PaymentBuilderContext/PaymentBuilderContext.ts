import { createContext, useContext } from 'react';

import { type ExpenditureAction } from '~types/graphql.ts';
import noop from '~utils/noop.ts';

export const PaymentBuilderContext = createContext<{
  toggleOnFundingModal: () => void;
  toggleOffFundingModal: () => void;
  isFundingModalOpen: boolean;
  toggleOnReleaseModal: () => void;
  toggleOffReleaseModal: () => void;
  isReleaseModalOpen: boolean;
  selectedFundingAction: ExpenditureAction | null;
  setSelectedFundingAction: (action: ExpenditureAction | null) => void;
}>({
  toggleOnFundingModal: noop,
  toggleOffFundingModal: noop,
  isFundingModalOpen: false,
  toggleOnReleaseModal: noop,
  toggleOffReleaseModal: noop,
  isReleaseModalOpen: false,
  selectedFundingAction: null,
  setSelectedFundingAction: noop,
});

export const usePaymentBuilderContext = () => useContext(PaymentBuilderContext);
