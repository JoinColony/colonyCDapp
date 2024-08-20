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
  selectedPermissionAction: ExpenditureAction | undefined;
  setSelectedPermissionAction: (data: ExpenditureAction) => void;
  selectedTransaction: string;
  setSelectedTransaction: (transaction: string) => void;
}>({
  toggleOnFundingModal: noop,
  toggleOffFundingModal: noop,
  isFundingModalOpen: false,
  toggleOnReleaseModal: noop,
  toggleOffReleaseModal: noop,
  isReleaseModalOpen: false,
  selectedPermissionAction: undefined,
  setSelectedPermissionAction: noop,
  selectedTransaction: '',
  setSelectedTransaction: noop,
});

export const usePaymentBuilderContext = () => useContext(PaymentBuilderContext);
