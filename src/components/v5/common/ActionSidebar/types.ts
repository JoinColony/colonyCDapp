import { FieldValues, UseFormReturn } from 'react-hook-form';

import { Action } from '~constants/actions';
import { ActionFormProps } from '~shared/Fields/Form/ActionForm';

export interface ActionButtonsProps {
  isActionDisabled?: boolean;
}

export interface PopularActionsProps {
  setSelectedAction: (action: Action | null) => void;
}

export interface ActionFormBaseProps {
  getFormOptions: (
    formOptions: Omit<ActionFormProps<any>, 'children'> | undefined,
    form: UseFormReturn,
  ) => void;
}

export type UseActionFormBaseHook = (
  options: {
    getFormOptions: ActionFormBaseProps['getFormOptions'];
  } & Pick<
    ActionFormProps<any>,
    'transform' | 'actionType' | 'defaultValues' | 'validationSchema'
  >,
) => void;

export interface ActionSidebarProps {
  initialValues?: FieldValues;
  transactionId?: string;
}
