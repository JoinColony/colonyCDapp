import { ColonyRole, Id } from '@colony/colony-js';
import { Scales } from '@phosphor-icons/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type Action, ACTION } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import useEnabledExtensions from '~hooks/useEnabledExtensions.tsx';
import { type Colony } from '~types/graphql.ts';
import { type Address } from '~types/index.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { ACTION_TYPE_FIELD_NAME } from '../../consts.tsx';
import { DecisionMethod } from '../../hooks/index.ts';

import { type DecisionMethodFieldProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.DecisionMethodField';

const getPermissionsNeededForAction = (
  actionType: Action,
  formValues: Record<string, any>,
): ColonyRole[] | undefined => {
  switch (actionType) {
    case ACTION.SIMPLE_PAYMENT:
      return [ColonyRole.Funding, ColonyRole.Administration];
    case ACTION.MINT_TOKENS:
      return [ColonyRole.Root];
    case ACTION.TRANSFER_FUNDS:
      return [ColonyRole.Funding];
    case ACTION.UNLOCK_TOKEN:
      return [ColonyRole.Root];
    case ACTION.MANAGE_TOKENS:
      return [ColonyRole.Root];
    case ACTION.CREATE_NEW_TEAM:
      return [ColonyRole.Architecture];
    case ACTION.EDIT_EXISTING_TEAM:
      return [ColonyRole.Architecture];
    case ACTION.MANAGE_REPUTATION:
      /**
       * @TODO: Once this action is wired, we'll need to tell if
       * it's a smite or award action (most likely from `formValues`)
       * If smite: Arbitration, else: Root
       */
      return undefined;
    case ACTION.MANAGE_PERMISSIONS: {
      const domainId = Number(formValues.team);
      if (!domainId) {
        return undefined;
      }
      return domainId === Id.RootDomain
        ? [ColonyRole.Root, ColonyRole.Architecture]
        : [ColonyRole.Architecture];
    }
    case ACTION.EDIT_COLONY_DETAILS:
    case ACTION.MANAGE_COLONY_OBJECTIVES:
      return [ColonyRole.Root];
    case ACTION.UPGRADE_COLONY_VERSION:
      return [ColonyRole.Root];
    case ACTION.ENTER_RECOVERY_MODE:
      return [ColonyRole.Recovery];
    default:
      return undefined;
  }
};

// Function returning the domain ID in which the user needs to have required permissions to create the action
const getRelevantPermissionsDomainId = (
  actionType: Action,
  formValues: Record<string, any>,
) => {
  switch (actionType) {
    case ACTION.SIMPLE_PAYMENT:
    case ACTION.TRANSFER_FUNDS:
      return formValues.from ? Number(formValues.from) : Id.RootDomain;
    case ACTION.MANAGE_REPUTATION:
    case ACTION.MANAGE_PERMISSIONS:
      return formValues.team ? Number(formValues.team) : Id.RootDomain;
    default:
      return Id.RootDomain;
  }
};

const getCanUsePermissions = (
  colony: Colony,
  walletAddress: Address,
  formValues: Record<string, any>,
) => {
  const { [ACTION_TYPE_FIELD_NAME]: actionType } = formValues;

  const requiredRoles = getPermissionsNeededForAction(actionType, formValues);
  if (!requiredRoles) {
    return false;
  }

  const relevantPermissionsDomainId = getRelevantPermissionsDomainId(
    actionType,
    formValues,
  );

  return addressHasRoles({
    requiredRoles,
    requiredRolesDomains: [relevantPermissionsDomainId],
    colony,
    address: walletAddress,
  });
};

const DecisionMethodField = ({
  permissionsOnly,
  disabled,
}: DecisionMethodFieldProps) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const { watch } = useFormContext();
  const formValues = watch();
  const { [ACTION_TYPE_FIELD_NAME]: actionType } = formValues;

  if (!actionType) {
    return null;
  }

  const canUsePermissions = getCanUsePermissions(
    colony,
    user?.walletAddress ?? '',
    formValues,
  );

  const decisionMethods = [
    ...(canUsePermissions
      ? [
          {
            label: formatText({ id: 'actionSidebar.method.permissions' }),
            value: DecisionMethod.Permissions,
          },
        ]
      : []),
    ...(isVotingReputationEnabled && !permissionsOnly
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
