import { Scales } from '@phosphor-icons/react';
import React from 'react';

import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import useEnabledExtensions from '~hooks/useEnabledExtensions.tsx';
import { getAllUserRoles } from '~transformers/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { useHasNoDecisionMethods } from '../../hooks/index.ts';

import { type DecisionMethodFieldProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.DecisionMethodField';

const DecisionMethodField = ({
  reputationOnly,
  disabled,
}: DecisionMethodFieldProps) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const userRoles = getAllUserRoles(colony, user?.walletAddress);

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const { isVotingReputationEnabled } = useEnabledExtensions();

  const shouldShowPermissions = !reputationOnly && userRoles.length > 0;

  const decisionMethods = [
    ...(shouldShowPermissions
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
      isDisabled={disabled || hasNoDecisionMethods}
    >
      <FormCardSelect
        name="decisionMethod"
        options={decisionMethods}
        title={formatText({ id: 'actionSidebar.availableDecisions' })}
        placeholder={formatText({
          id: 'actionSidebar.decisionMethod.placeholder',
        })}
        disabled={disabled || hasNoDecisionMethods}
        cardClassName="sm:min-w-[12.875rem]"
      />
    </ActionFormRow>
  );
};

DecisionMethodField.displayName = displayName;

export default DecisionMethodField;
