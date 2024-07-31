import React, { type FC } from 'react';

import ColonyObjectiveFields from '~v5/common/ActionSidebar/partials/ColonyObjectiveFields/index.ts';

import { type CreateActionFormProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';

import { useManageColonyObjectives } from './hooks.ts';

const displayName =
  'v5.common.ActionSidebar.partials.ManageColonyObjectivesForm';

const ManageColonyObjectivesForm: FC<CreateActionFormProps> = ({
  getFormOptions,
}) => {
  useManageColonyObjectives(getFormOptions);

  return (
    <>
      <ColonyObjectiveFields />
      <DecisionMethodField />
      <CreatedIn readonly />
      <Description />
    </>
  );
};

ManageColonyObjectivesForm.displayName = displayName;

export default ManageColonyObjectivesForm;
