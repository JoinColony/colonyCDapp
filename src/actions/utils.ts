import { type ColonyRole } from '@colony/colony-js';
import { type FC } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type MessageDescriptor } from 'react-intl';

import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { type CoreAction } from './core/types.ts';
import defaultForm from './Default.ts';

type ActionFormIdentifier = Required<Omit<MessageDescriptor, 'description'>>;

export interface ActionDefinition {
  // FIXME: eventually we want to get rid of CreateActionFormProps (especially getFormOptions)
  component?: FC<CreateActionFormProps>;
  name: ActionFormIdentifier;
  permissionDomainId?: (formContext: UseFormReturn) => number;
  requiredPermissions?: ColonyRole[][];
  type: CoreAction;
  // @TODO: add this later
  // validationSchema: ObjectSchema;
}

const ACTIONS_CORE = new Map<CoreAction, ActionDefinition>();

const getAction = (type?: CoreAction): ActionDefinition => {
  if (!type) {
    return defaultForm;
  }
  const action = ACTIONS_CORE.get(type);
  if (!action) {
    throw new Error(`Form with id ${type} is not registered`);
  }
  return action;
};

export const registerAction = (action: ActionDefinition) => {
  ACTIONS_CORE.set(action.type, action);
  return action.type;
};

export const getFormComponent = (type?: CoreAction) => {
  const { component } = getAction(type);
  return component;
};

export const getFormOptions = (type: CoreAction) => {
  const { name, permissionDomainId, requiredPermissions } = getAction(type);
  return {
    type,
    name,
    permissionDomainId,
    requiredPermissions,
  };
};
export const getFormName = (type: CoreAction) => {
  const { name } = getAction(type);
  return name;
};

export const getActionPermissions = (type: CoreAction) => {
  const action = getAction(type);
  return action.requiredPermissions || [];
};
