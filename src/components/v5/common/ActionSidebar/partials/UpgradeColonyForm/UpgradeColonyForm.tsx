import React, { FC, PropsWithChildren } from 'react';

import { useUpgradeColony } from './hooks';
import ActionForm from '../ActionForm/ActionForm';

const displayName = 'v5.common.ActionSidebar.partials.UpgradeColonyForm';

const UpgradeColonyForm: FC<PropsWithChildren> = ({ children }) => (
  <ActionForm useActionHook={useUpgradeColony}>{children}</ActionForm>
);

UpgradeColonyForm.displayName = displayName;

export default UpgradeColonyForm;
