import React, { FC, PropsWithChildren } from 'react';

import { useSinglePayment } from './hooks';
import ActionForm from '../ActionForm/ActionForm';

const displayName = 'v5.common.ActionSidebar.partials.SinglePaymentForm';

const SinglePaymentForm: FC<PropsWithChildren> = ({ children }) => {
  return <ActionForm useActionHook={useSinglePayment}>{children}</ActionForm>;
};

SinglePaymentForm.displayName = displayName;

export default SinglePaymentForm;
