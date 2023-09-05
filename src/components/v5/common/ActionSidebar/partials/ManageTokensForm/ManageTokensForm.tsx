import React, { FC, PropsWithChildren } from 'react';

import ActionForm from '../ActionForm';
import { useManageTokens } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.ManageTokensForm';

const ManageTokensForm: FC<PropsWithChildren> = ({ children }) => (
  <ActionForm useActionHook={useManageTokens}>{children}</ActionForm>
);

ManageTokensForm.displayName = displayName;

export default ManageTokensForm;
