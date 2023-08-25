import React, { FC, PropsWithChildren } from 'react';

import ActionForm from '../ActionForm';
import { useCreateDecision } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.CreateDecisionForm';

const CreateDecisionForm: FC<PropsWithChildren> = ({ children }) => (
  <ActionForm useActionHook={useCreateDecision}>{children}</ActionForm>
);

CreateDecisionForm.displayName = displayName;

export default CreateDecisionForm;
