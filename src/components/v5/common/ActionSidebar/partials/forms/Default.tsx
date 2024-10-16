import React, { type FC } from 'react';

import ActionFormLayout from '~v5/common/ActionSidebar/partials/ActionFormLayout/ActionFormLayout.tsx';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

const displayName = 'v5.common.ActionSidebar.forms.Default';

const Default: FC<CreateActionFormProps> = () => {
  return <ActionFormLayout />;
};

Default.displayName = displayName;

export default Default;
