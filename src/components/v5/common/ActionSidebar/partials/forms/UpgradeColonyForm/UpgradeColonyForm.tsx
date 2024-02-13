import React, { type FC } from 'react';

import ColonyVersionField from '~v5/common/ActionSidebar/partials/ColonyVersionField/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import DescriptionRow from '../../DescriptionRow/index.ts';

import { useUpgradeColony } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.UpgradeColonyForm';

const UpgradeColonyForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useUpgradeColony(getFormOptions);

  return (
    <>
      <ColonyVersionField />
      <DecisionMethodField />
      <CreatedInRow />
      <DescriptionRow />
    </>
  );
};

UpgradeColonyForm.displayName = displayName;

export default UpgradeColonyForm;
