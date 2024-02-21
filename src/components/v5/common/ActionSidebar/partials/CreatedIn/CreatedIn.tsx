import { HouseLine } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useWatch } from 'react-hook-form';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';

import { DECISION_METHOD_FIELD_NAME } from '../../consts.tsx';
import { useHasNoDecisionMethods } from '../../hooks/index.ts';
import TeamsSelect from '../TeamsSelect/index.ts';

import { type CreatedInProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.CreatedIn';

const CreatedIn: FC<CreatedInProps> = ({ filterOptionsFn, readonly }) => {
  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  return decisionMethod === DecisionMethod.Reputation || readonly ? (
    <ActionFormRow
      icon={HouseLine}
      fieldName="createdIn"
      tooltips={{
        label: {
          tooltipContent: formatText({
            id: 'actionSidebar.tooltip.createdIn',
          }),
        },
      }}
      title={formatText({ id: 'actionSidebar.createdIn' })}
      isDisabled={hasNoDecisionMethods}
    >
      <TeamsSelect
        name="createdIn"
        filterOptionsFn={filterOptionsFn}
        readonly={readonly}
      />
    </ActionFormRow>
  ) : null;
};

CreatedIn.displayName = displayName;

export default CreatedIn;
