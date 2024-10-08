import React, { type FC } from 'react';

import ColonyVersionField from '~v5/common/ActionSidebar/partials/ColonyVersionField/index.ts';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import { useUpgradeColony } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.UpgradeColonyForm';

const UpgradeColonyForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useUpgradeColony(getFormOptions);

  return (
    <>
      <ColonyVersionField />
      <DecisionMethodField />
      <CreatedIn readonly />
      <Description />
    </>
  );
};

UpgradeColonyForm.displayName = displayName;

export default UpgradeColonyForm;
