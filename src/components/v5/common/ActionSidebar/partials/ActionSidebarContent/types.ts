import { type FieldError, type UseFormReturn } from 'react-hook-form';

import { type IActionContext } from '~context/ActionContext/ActionContext.ts';
import { type ActionFormProps } from '~shared/Fields/Form/index.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

export interface ActionSidebarFormContentProps extends ActionFormBaseProps {
  isExpenditure?: boolean;
  actionFormProps: Omit<ActionFormProps, 'children' | 'actionType'>;
  customError?: null | Pick<FieldError, 'message'>;
}

export interface ActionSidebarContentProps {
  transactionHash: IActionContext['transactionHash'];
  formRef: React.RefObject<UseFormReturn<object, any, undefined>>;
  defaultValues: ActionFormProps<any>['defaultValues'];
  isMotion?: boolean;
}

export interface PermissionSidebarProps {
  action: ColonyAction;
}
