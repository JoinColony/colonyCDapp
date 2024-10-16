import { Id } from '@colony/colony-js';
import { type ReactNode } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { generateMessageValues } from '~common/ColonyActions/helpers/getEventTitleValues.ts';
import { mapColonyActionToExpectedFormat } from '~common/ColonyActions/index.ts';
import { DecisionMethod } from '~gql';
import {
  type Colony,
  type Expenditure,
  type ColonyMetadata,
} from '~types/graphql.ts';
import { omit } from '~utils/lodash.ts';
import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import Default from '~v5/common/ActionSidebar/partials/forms/Default.tsx';

import { CoreActionGroup, type CoreAction } from './core/types.ts';
import {
  type ActionDefinition,
  type ActionData,
  type ActionTitleKey,
  type CoreActionOrGroup,
} from './types.ts';

const ACTIONS_CORE = new Map<CoreAction | CoreActionGroup, ActionDefinition>();

const getAction = (type: CoreActionOrGroup): ActionDefinition => {
  const action = ACTIONS_CORE.get(type);
  if (!action) {
    throw new Error(`Form with id ${type} is not registered`);
  }
  return action;
};

export const registerAction = (action: ActionDefinition) => {
  // We have some sub-actions, so we register the sub-actions,
  // merged with the properties of the parent action
  if (action.actions) {
    Object.values(action.actions).forEach((a) => {
      registerAction({
        ...omit(action, ['actions']),
        ...a,
      });
    });
  }
  // We are storing the group as well as the sub-actions (individually)
  ACTIONS_CORE.set(action.type, action);

  return action.type;
};

export const getFormComponent = (type?: CoreActionOrGroup) => {
  if (!type) {
    return Default;
  }
  const { component } = getAction(type);
  if (!component) {
    throw new Error(`No form component registered for action type ${type}`);
  }
  return component;
};

export const getFormOptions = (type: CoreActionOrGroup) => {
  const { name, permissionDomainId, requiredPermissions } = getAction(type);
  return {
    type,
    name,
    permissionDomainId,
    requiredPermissions,
  };
};
export const getName = (type: CoreActionOrGroup) => {
  const { name } = getAction(type);
  return name;
};

export const getRequiredPermissions = (
  type: CoreActionOrGroup,
  form?: UseFormReturn,
) => {
  const action = getAction(type);

  if (typeof action.requiredPermissions === 'function') {
    if (!form) {
      throw new Error(
        `form argument is required to get permissions for action type ${type}`,
      );
    }
    return action.requiredPermissions(form);
  }

  return action.requiredPermissions || [];
};

export const getPermissionDomainId = (
  type: CoreActionOrGroup,
  form: UseFormReturn,
) => {
  const action = getAction(type);
  if (action.permissionDomainId) {
    return action.permissionDomainId(form);
  }
  const decisionMethod = form.getValues(DECISION_METHOD_FIELD_NAME);

  if (!decisionMethod || decisionMethod !== DecisionMethod.Reputation) {
    return Id.RootDomain;
  }

  return form.watch(CREATED_IN_FIELD_NAME);
};

export const getTitleKeys = (type: CoreActionOrGroup) => {
  const { titleKeys } = getAction(type);
  return titleKeys || [];
};

const getChangelogItem = (
  {
    isMultiSig: actionIsMultiSig,
    isMotion: actionIsMotion,
    transactionHash,
    pendingColonyMetadata,
  }: ActionData,
  colonyMetadata: ColonyMetadata | null | undefined,
) => {
  const metadataObject =
    actionIsMotion || actionIsMultiSig ? pendingColonyMetadata : colonyMetadata;

  return metadataObject?.changelog?.find(
    (item) => item.transactionHash === transactionHash,
  );
};

/* Returns the correct message values according to the action type. */
export const getTitleValues = ({
  actionData,
  colony,
  keyFallbackValues,
  expenditureData,
}: {
  actionData: ActionData;
  colony: Pick<Colony, 'metadata' | 'nativeToken'>;
  keyFallbackValues?: Partial<Record<ActionTitleKey, ReactNode>>;
  expenditureData?: Expenditure;
}) => {
  const { isMotion, pendingColonyMetadata } = actionData;

  const updatedItem = mapColonyActionToExpectedFormat({
    actionData,
    colony,
    keyFallbackValues,
    expenditureData,
  });

  const metadata = isMotion ? pendingColonyMetadata : colony.metadata;

  // FIXME: Create a migration to either add the action type to the db or remove these actions entirely
  // Speak to Raul/Jakub
  // Then this whole thing can be deleted
  const changelogItem = getChangelogItem(actionData, metadata);

  /**
   * This is still needed to allow users to view existing Colony Objectives in the Completed Action component
   */
  const actionType = changelogItem?.hasObjectiveChanged
    ? CoreActionGroup.UpdateColonyObjective
    : actionData.type;
  const keys = getTitleKeys(actionType);

  return generateMessageValues(updatedItem, keys, {
    actionType,
  });
};
