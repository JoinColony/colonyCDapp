import { UseFormReturn } from 'react-hook-form';

import { ActionFormProps } from '~shared/Fields/Form';

import { UseGetColonyActionReturnType } from '../../hooks';
import { ActionFormBaseProps } from '../../types';

export type ActionSidebarFormContentProps = ActionFormBaseProps &
  Pick<UseGetColonyActionReturnType, 'action'>;

export interface ActionSidebarContentProps {
  transactionId?: string;
  formRef: React.RefObject<UseFormReturn<object, any, undefined>>;
  defaultValues: ActionFormProps<any>['defaultValues'];
  getColonyActionData: UseGetColonyActionReturnType;
}

export interface PermissionSidebarProps {
  transactionId: string;
}
