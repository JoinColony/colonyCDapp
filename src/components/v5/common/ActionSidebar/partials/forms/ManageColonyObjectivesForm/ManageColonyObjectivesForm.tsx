import React, { FC } from 'react';

import ColonyObjectiveFields from '~v5/common/ActionSidebar/partials/ColonyObjectiveFields';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import ActionFormRow from '~v5/common/ActionFormRow';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { formatText } from '~utils/intl';
import { useDecisionMethods } from '~v5/common/ActionSidebar/hooks';

import { ActionFormBaseProps } from '../../../types';
import { useManageColonyObjectives } from './hooks';
import DescriptionRow from '../../DescriptionRow';

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
      <ActionFormRow
        iconName="house-line"
        fieldName="createdIn"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.createdIn',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.createdIn' })}
      >
        <TeamsSelect name="createdIn" />
      </ActionFormRow>
      <ActionFormRow
        iconName="scales"
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
          title={formatText({ id: 'actionSidebar.decisionMethod' })}
        />
      </ActionFormRow>
      <DescriptionRow />
    </>
  );
};

ManageColonyObjectivesForm.displayName = displayName;

export default ManageColonyObjectivesForm;
