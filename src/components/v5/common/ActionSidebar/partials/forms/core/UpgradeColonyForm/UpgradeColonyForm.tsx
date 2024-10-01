import React, { type FC } from 'react';

import ActionFormLayout from '~v5/common/ActionSidebar/partials/ActionFormLayout/ActionFormLayout.tsx';
import ColonyVersionField from '~v5/common/ActionSidebar/partials/ColonyVersionField/index.ts';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { useUpgradeColony } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.UpgradeColonyForm';

const UpgradeColonyForm: FC<CreateActionFormProps> = ({ getFormOptions }) => {
  useUpgradeColony(getFormOptions);

  return (
    <ActionFormLayout>
      <ColonyVersionField />
      <DecisionMethodField />
      <CreatedIn readonly />
      <Description />
    </ActionFormLayout>
  );
};

UpgradeColonyForm.displayName = displayName;

export default UpgradeColonyForm;
