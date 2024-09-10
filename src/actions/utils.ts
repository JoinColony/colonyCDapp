import { type ColonyRole } from '@colony/colony-js';
import { type FC } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type MessageDescriptor } from 'react-intl';

import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { type ActionCore } from './core/index.ts';
import defaultForm from './Default.ts';

type ActionFormIdentifier = Required<Omit<MessageDescriptor, 'description'>>;

export interface ActionDefinition {
  // FIXME: eventually we want to get rid of CreateActionFormProps (especially getFormOptions)
  component: FC<CreateActionFormProps>;
  name: ActionFormIdentifier;
  permissionDomainId?: (formContext: UseFormReturn) => number;
  requiredPermissions?: ColonyRole[][];
  // @TODO: add this later
  // validationSchema: ObjectSchema;
}

const ACTIONS_CORE = new Map<number, ActionDefinition>();
let count = 1;

const getAction = (id?: ActionCore): ActionDefinition => {
  if (!id) {
    return defaultForm;
  }
  const action = ACTIONS_CORE.get(id);
  if (!action) {
    throw new Error(`Form with id ${id} is not registered`);
  }
  return action;
};

export const registerAction = (form: ActionDefinition) => {
  const id = count;
  ACTIONS_CORE.set(id, form);
  count += 1;
  return id;
};

export const getFormComponent = (id?: ActionCore) => {
  const { component } = getAction(id);
  return component;
};

export const getFormOptions = (id: ActionCore) => {
  const { name, permissionDomainId, requiredPermissions } = getAction(id);
  return {
    id,
    name,
    permissionDomainId,
    requiredPermissions,
  };
};
export const getFormName = (id: ActionCore) => {
  const { name } = getAction(id);
  return name;
};

export const getActionPermissions = (id: ActionCore) => {
  const action = getAction(id);
  return action.requiredPermissions || [];
};
