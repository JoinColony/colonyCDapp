import React, { FC, PropsWithChildren } from 'react';

import { useCreateDecision } from './hooks';
import ActionForm from '../ActionForm/ActionForm';

const displayName = 'v5.common.ActionSidebar.partials.SinglePaymentForm';

const CreateDecisionForm: FC<PropsWithChildren> = ({ children }) => (
  <ActionForm useActionHook={useCreateDecision}>{children}</ActionForm>
);

CreateDecisionForm.displayName = displayName;

export default CreateDecisionForm;
