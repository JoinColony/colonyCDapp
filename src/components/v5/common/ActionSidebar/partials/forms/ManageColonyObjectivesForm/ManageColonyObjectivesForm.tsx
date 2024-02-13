import React, { type FC } from 'react';

import { MAX_OBJECTIVE_DESCRIPTION_LENGTH } from '~constants/index.ts';
import ColonyObjectiveFields from '~v5/common/ActionSidebar/partials/ColonyObjectiveFields/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import DescriptionRow from '../../DescriptionRow/index.ts';

import { useManageColonyObjectives } from './hooks.ts';

const displayName =
  'v5.common.ActionSidebar.partials.ManageColonyObjectivesForm';

const ManageColonyObjectivesForm: FC<ActionFormBaseProps> = ({
  getFormOptions,
}) => {
  useManageColonyObjectives(getFormOptions);

  return (
    <>
      <ColonyObjectiveFields />
      <DecisionMethodField />
      <CreatedInRow />
      <DescriptionRow maxDescriptionLength={MAX_OBJECTIVE_DESCRIPTION_LENGTH} />
    </>
  );
};

ManageColonyObjectivesForm.displayName = displayName;

export default ManageColonyObjectivesForm;
