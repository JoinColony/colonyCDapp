import React, { FC, PropsWithChildren } from 'react';

import ActionForm from '../ActionForm';
import { useMintToken } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.MintTokenForm';

const MintTokenForm: FC<PropsWithChildren> = ({ children }) => (
  <ActionForm useActionHook={useMintToken}>{children}</ActionForm>
);

MintTokenForm.displayName = displayName;

export default MintTokenForm;
