import { Scales } from '@phosphor-icons/react';
import React from 'react';
import { useWatch } from 'react-hook-form';

import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { getAllUserRoles } from '~transformers/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
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
  const userRoles = getAllUserRoles(
    extractColonyRoles(colony.roles),
    user?.walletAddress,
  );
  const userMultiSigRoles = getAllUserRoles(
    extractColonyRoles(colony.roles),
    user?.walletAddress,
    true,
  );

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const {
    isVotingReputationEnabled,
    isMultiSigEnabled,
    isStakedExpenditureEnabled,
  } = useEnabledExtensions();
  const actionType = useWatch({ name: ACTION_TYPE_FIELD_NAME });

  const shouldShowPermissions = !reputationOnly && userRoles.length > 0;
  const shouldShowStaking =
    isStakedExpenditureEnabled && actionType === Action.PaymentBuilder;
  const shouldShowMultiSig =
    !reputationOnly && isMultiSigEnabled && userMultiSigRoles.length > 0;

  const getDecisionMethods = () => {
    const decisionMethods: DecisionMethodOption[] = [
      ...(shouldShowPermissions
        ? [
            {
              label: formatText({ id: 'decisionMethod.permissions' }),
              value: DecisionMethod.Permissions,
            },
          ]
        : []),
      ...(isVotingReputationEnabled
        ? [
            {
              label: formatText({ id: 'decisionMethod.reputation' }),
              value: DecisionMethod.Reputation,
            },
          ]
        : []),
      ...(shouldShowMultiSig
        ? [
            {
              label: formatText({ id: 'decisionMethod.multiSig' }),
              value: DecisionMethod.MultiSig,
            },
          ]
        : []),
      ...(shouldShowStaking
        ? [
            {
              label: formatText({ id: 'decisionMethod.staking' }),
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
