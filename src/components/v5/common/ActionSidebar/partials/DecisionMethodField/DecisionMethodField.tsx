import { Scales } from '@phosphor-icons/react';
import React from 'react';

import useEnabledExtensions from '~hooks/useEnabledExtensions.tsx';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { type DecisionMethodFieldProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.DecisionMethodField';

const DecisionMethodField = ({
  reputationOnly,
  disabled,
}: DecisionMethodFieldProps) => {
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const decisionMethods = [
    ...(!reputationOnly
      ? [
          {
            label: formatText({ id: 'actionSidebar.method.permissions' }),
            value: DecisionMethod.Permissions,
          },
        ]
      : []),
    ...(isVotingReputationEnabled
      ? [
          {
            label: formatText({ id: 'actionSidebar.method.reputation' }),
            value: DecisionMethod.Reputation,
          },
        ]
      : []),
  ];

  return (
    <ActionFormRow
      icon={Scales}
      fieldName="decisionMethod"
      tooltips={{
        label: {
          tooltipContent: formatText({
            id: 'actionSidebar.tooltip.decisionMethod',
          }),
        },
      }}
      title={formatText({ id: 'actionSidebar.decisionMethod' })}
      isDisabled={disabled}
    >
      <FormCardSelect
        name="decisionMethod"
        options={decisionMethods}
        title={formatText({ id: 'actionSidebar.availableDecisions' })}
        placeholder={formatText({
          id: 'actionSidebar.decisionMethod.placeholder',
        })}
      />
    </ActionFormRow>
  );
};

DecisionMethodField.displayName = displayName;

export default DecisionMethodField;
