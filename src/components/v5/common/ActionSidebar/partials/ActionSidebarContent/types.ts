import { type UseFormReturn } from 'react-hook-form';

import { type ActionFormProps } from '~shared/Fields/Form/index.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

export interface ActionSidebarFormContentProps extends ActionFormBaseProps {
  isMotion?: boolean;
  transactionId?: string;
  isExpenditure?: boolean;
  actionFormProps: Omit<ActionFormProps<any>, 'children'>;
}

export interface ActionSidebarContentProps {
  transactionId?: string;
  formRef: React.RefObject<UseFormReturn<object, any, undefined>>;
  defaultValues: ActionFormProps<any>['defaultValues'];
  isMotion?: boolean;
}

export interface PermissionSidebarProps {
  action: ColonyAction;
}
