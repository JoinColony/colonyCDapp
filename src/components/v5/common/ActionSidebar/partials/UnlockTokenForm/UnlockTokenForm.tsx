import React, { FC, PropsWithChildren } from 'react';

import { useUnlockToken } from './hooks';
import ActionForm from '../ActionForm/ActionForm';

const displayName = 'v5.common.ActionSidebar.partials.UnlockTokenForm';

const UnlockTokenForm: FC<PropsWithChildren> = ({ children }) => (
  <ActionForm useActionHook={useUnlockToken}>{children}</ActionForm>
);

UnlockTokenForm.displayName = displayName;

export default UnlockTokenForm;
