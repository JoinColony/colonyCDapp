import { UseFormReturn } from 'react-hook-form';

import { ActionFormProps } from '~shared/Fields/Form/index.ts';

import { ActionFormBaseProps } from '../../types.ts';

export interface ActionSidebarFormContentProps extends ActionFormBaseProps {
  isMotion?: boolean;
}

export interface ActionSidebarContentProps {
  transactionId?: string;
  formRef: React.RefObject<UseFormReturn<object, any, undefined>>;
  defaultValues: ActionFormProps<any>['defaultValues'];
  isMotion?: boolean;
}

export interface PermissionSidebarProps {
  transactionId: string;
}
