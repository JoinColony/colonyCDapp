import React, { type FC } from 'react';

import ColonyVersionField from '~v5/common/ActionSidebar/partials/ColonyVersionField/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';

import { useUpgradeColony } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.UpgradeColonyForm';

const UpgradeColonyForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useUpgradeColony(getFormOptions);

  return (
    <>
      <ColonyVersionField />
      <DecisionMethodField />
      <CreatedIn />
      <Description />
    </>
  );
};

UpgradeColonyForm.displayName = displayName;

export default UpgradeColonyForm;
