import { HouseLine } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useWatch } from 'react-hook-form';

import { DecisionMethod } from '~gql';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';

import TeamsSelect from '../TeamsSelect/index.ts';

import { type CreatedInProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.CreatedIn';

const CreatedIn: FC<CreatedInProps> = ({ filterOptionsFn, readonly }) => {
  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  return decisionMethod === DecisionMethod.Reputation ? (
    <ActionFormRow
      icon={HouseLine}
      fieldName={CREATED_IN_FIELD_NAME}
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
        name={CREATED_IN_FIELD_NAME}
        filterOptionsFn={filterOptionsFn}
        readonly={readonly}
      />
    </ActionFormRow>
  ) : null;
};

CreatedIn.displayName = displayName;

export default CreatedIn;
