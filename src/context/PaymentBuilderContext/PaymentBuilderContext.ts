import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';
import { type PermissionsBoxItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PermissionsBox/types.ts';

export const PaymentBuilderContext = createContext<{
  toggleOnFundingModal: () => void;
  toggleOffFundingModal: () => void;
  isFundingModalOpen: boolean;
  toggleOnReleaseModal: () => void;
  toggleOffReleaseModal: () => void;
  isReleaseModalOpen: boolean;
  selectedPermissionAction: PermissionsBoxItem | undefined;
  setSelectedPermissionAction: (data: PermissionsBoxItem) => void;
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
