import React, { FC, PropsWithChildren } from 'react';

import { useEnterRecoveryMode } from './hooks';
import ActionForm from '../ActionForm/ActionForm';

const displayName = 'v5.common.ActionSidebar.partials.EnterRecoveryModeForm';

const EnterRecoveryModeForm: FC<PropsWithChildren> = ({ children }) => (
  <ActionForm useActionHook={useEnterRecoveryMode}>{children}</ActionForm>
);

EnterRecoveryModeForm.displayName = displayName;

export default EnterRecoveryModeForm;
