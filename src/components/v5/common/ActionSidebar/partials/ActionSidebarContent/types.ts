import { type UseFormReturn } from 'react-hook-form';

import { type ActionFormProps } from '~shared/Fields/Form/index.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

export interface ActionSidebarFormContentProps extends ActionFormBaseProps {
  isMotion?: boolean;
  transactionId?: string;
  isExpenditure?: boolean;
}

export interface ActionSidebarContentProps {
  transactionId?: string;
  formRef: React.RefObject<UseFormReturn<object, any, undefined>>;
  defaultValues: ActionFormProps<any>['defaultValues'];
  isMotion?: boolean;
  isMultiSig?: boolean;
}

export interface PermissionSidebarProps {
  transactionId: string;
}
