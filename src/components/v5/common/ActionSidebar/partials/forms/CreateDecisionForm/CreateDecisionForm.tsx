import React, { type FC } from 'react';
import { useWatch } from 'react-hook-form';

import { ACTION, type Action } from '~constants/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { DecisionMethod, useDecisionMethods } from '../../../hooks/index.ts';
import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DescriptionRow from '../../DescriptionRow/index.ts';
import { useIsFieldDisabled } from '../../hooks.ts';

import { useCreateDecision } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.SinglePaymentForm';

const CreateDecisionForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();
  const isFieldDisabled = useIsFieldDisabled();
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });

  const filteredDecisionMethods =
    selectedAction === ACTION.CREATE_DECISION
      ? decisionMethods.filter(
          (method) => method.value !== DecisionMethod.Permissions,
        )
      : decisionMethods;

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
        isDisabled={isFieldDisabled}
      >
        <FormCardSelect
          name="decisionMethod"
          placeholder={formatText({
            id: 'actionSidebar.decisionMethod.placeholder',
          })}
          options={filteredDecisionMethods}
          title={formatText({ id: 'actionSidebar.decisionMethod' })}
          disabled={isFieldDisabled}
        />
      </ActionFormRow>
      <CreatedInRow />
      <DescriptionRow />
    </>
  );
};

CreateDecisionForm.displayName = displayName;

export default CreateDecisionForm;
