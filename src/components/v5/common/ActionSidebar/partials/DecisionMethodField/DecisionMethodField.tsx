import { Scales } from '@phosphor-icons/react';
import React from 'react';
import { useWatch } from 'react-hook-form';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { getAllUserRoles } from '~transformers/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import { actionsWithStakingDecisionMethod } from '~v5/common/ActionSidebar/hooks/permissions/consts.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import {
  type DecisionMethodOption,
  type DecisionMethodFieldProps,
} from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.DecisionMethodField';

const DecisionMethodField = ({
  reputationOnly,
  disabled,
  tooltipContent = 'actionSidebar.tooltip.decisionMethod',
  filterOptionsFn,
}: DecisionMethodFieldProps) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const userRoles = getAllUserRoles(colony, user?.walletAddress);

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const { isVotingReputationEnabled, isStakedExpenditureEnabled } =
    useEnabledExtensions();
  const actionType = useWatch({ name: ACTION_TYPE_FIELD_NAME });

  const shouldShowPermissions = !reputationOnly && userRoles.length > 0;
  const shouldShowStaking =
    isStakedExpenditureEnabled &&
    actionsWithStakingDecisionMethod.includes(actionType);

  const getDecisionMethods = () => {
    const decisionMethods: DecisionMethodOption[] = [
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
      ...(shouldShowStaking
        ? [
            {
              label: formatText({ id: 'actionSidebar.method.staking' }),
              value: DecisionMethod.Staking,
            },
          ]
        : []),
    ];

    if (filterOptionsFn) {
      return decisionMethods?.filter(filterOptionsFn);
    }

    return decisionMethods;
  };

  return (
    <ActionFormRow
      icon={Scales}
      fieldName="decisionMethod"
      tooltips={{
        label: {
          tooltipContent: formatText({
            id: tooltipContent,
          }),
        },
      }}
      title={formatText({ id: 'actionSidebar.decisionMethod' })}
      isDisabled={disabled || hasNoDecisionMethods}
    >
      <FormCardSelect
        name="decisionMethod"
        options={getDecisionMethods()}
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
