import React, { FC } from 'react';

import { formatText } from '~utils/intl';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';

import { useDecisionMethods } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';
import DescriptionRow from '../../DescriptionRow';

import { useCreateDecision } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.SinglePaymentForm';

const CreateDecisionForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();

  useCreateDecision(getFormOptions);

  return (
    <>
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
          placeholder={formatText({
            id: 'actionSidebar.decisionMethod.placeholder',
          })}
          options={decisionMethods}
          title={formatText({ id: 'actionSidebar.availableDecisions' })}
        />
      </ActionFormRow>
      <ActionFormRow
        icon="house-line"
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
      <DescriptionRow />
    </>
  );
};

CreateDecisionForm.displayName = displayName;

export default CreateDecisionForm;
