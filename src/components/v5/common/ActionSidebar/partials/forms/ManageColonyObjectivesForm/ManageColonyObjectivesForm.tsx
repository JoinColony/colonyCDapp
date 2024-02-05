import React, { type FC } from 'react';

import { MAX_OBJECTIVE_DESCRIPTION_LENGTH } from '~constants/index.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { useDecisionMethods } from '~v5/common/ActionSidebar/hooks/index.ts';
import ColonyObjectiveFields from '~v5/common/ActionSidebar/partials/ColonyObjectiveFields/index.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DescriptionRow from '../../DescriptionRow/index.ts';

import { useManageColonyObjectives } from './hooks.ts';

const displayName =
  'v5.common.ActionSidebar.partials.ManageColonyObjectivesForm';

const ManageColonyObjectivesForm: FC<ActionFormBaseProps> = ({
  getFormOptions,
}) => {
  const { decisionMethods } = useDecisionMethods();

  useManageColonyObjectives(getFormOptions);

  return (
    <>
      <ColonyObjectiveFields />
      <CreatedInRow />
      <ActionFormRow
        icon="scales"
        fieldName="decisionMethod"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.decisionMethod',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.decisionMethod' })}
      >
        <FormCardSelect
          name="decisionMethod"
          options={decisionMethods}
          placeholder={formatText({
            id: 'actionSidebar.decisionMethod.placeholder',
          })}
          title={formatText({ id: 'actionSidebar.availableDecisions' })}
        />
      </ActionFormRow>
      <DescriptionRow maxDescriptionLength={MAX_OBJECTIVE_DESCRIPTION_LENGTH} />
    </>
  );
};

ManageColonyObjectivesForm.displayName = displayName;

export default ManageColonyObjectivesForm;
