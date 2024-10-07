import { Id, type ColonyRole } from '@colony/colony-js';
import { type FC, type ReactNode } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type MessageDescriptor } from 'react-intl';

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
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { CoreActionGroup, type CoreAction } from './core/types.ts';
import {
  type ActionData,
  type ActionTitleKey,
  type CoreActionOrGroup,
} from './index.ts';

type ActionMessageDescriptor = Required<Omit<MessageDescriptor, 'description'>>;

interface MinimalActionDefinition {
  // FIXME: eventually we want to get rid of CreateActionFormProps (especially getFormOptions)
  component?: FC<CreateActionFormProps>;
  name: ActionMessageDescriptor;
  permissionDomainId?: (form: UseFormReturn) => number;
  requiredPermissions?: ColonyRole[][];
  title?: ActionMessageDescriptor;
  titleKeys?: ActionTitleKey[];
  type: CoreAction;
  // @TODO: add this later
  // validationSchema: ObjectSchema;
}

export type ActionDefinition = Omit<MinimalActionDefinition, 'type'> & {
  actions?: Record<string, MinimalActionDefinition>;
  type: CoreActionOrGroup;
};

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
export const getActionName = (type: CoreActionOrGroup) => {
  const { name } = getAction(type);
  return name;
};

export const getActionPermissions = (type: CoreActionOrGroup) => {
  const action = getAction(type);
  return action.requiredPermissions || [];
};

export const getActionPermissionDomainId = (
  type: CoreActionOrGroup,
  form: UseFormReturn,
) => {
  const action = getAction(type);
  if (action.permissionDomainId) {
    return action.permissionDomainId(form);
  }
  const decisionMethod = form.getValues(DECISION_METHOD_FIELD_NAME);
  if (!decisionMethod) {
    return Id.RootDomain;
  }

  const isMotion =
    decisionMethod && decisionMethod === DecisionMethod.Reputation;

  if (!isMotion) {
    return Id.RootDomain;
  }

  return form.watch(CREATED_IN_FIELD_NAME);
};

export const getActionTitleKeys = (type: CoreActionOrGroup) => {
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
export const getActionTitleValues = ({
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
  const keys = getActionTitleKeys(actionType);

  return generateMessageValues(updatedItem, keys, {
    actionType,
  });
};
