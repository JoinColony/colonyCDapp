import React, { FC, PropsWithChildren } from 'react';

import { useTransferFunds } from './hooks';
import ActionForm from '../ActionForm/ActionForm';

const displayName = 'v5.common.ActionSidebar.partials.TransferFundsForm';

const TransferFundsForm: FC<PropsWithChildren> = ({ children }) => (
  <ActionForm useActionHook={useTransferFunds}>{children}</ActionForm>
);

TransferFundsForm.displayName = displayName;

export default TransferFundsForm;
