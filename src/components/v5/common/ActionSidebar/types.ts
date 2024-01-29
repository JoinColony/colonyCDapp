import { type FieldValues, type UseFormReturn } from 'react-hook-form';

import { type Action } from '~constants/actions.ts';
import { type ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';

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
