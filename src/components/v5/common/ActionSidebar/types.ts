import { type FieldValues, type UseFormReturn } from 'react-hook-form';

import { type ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';

export interface ActionButtonsProps {
  isActionDisabled?: boolean;
  onSubmitClick?: () => void;
}

export interface ActionFormOptions
  extends Omit<ActionFormProps<any>, 'children' | 'onSuccess'> {
  onSuccess?: () => void;
}

export interface ActionFormBaseProps {
  getFormOptions: (
    formOptions: ActionFormOptions | undefined,
    form: UseFormReturn,
  ) => void;
}

export type UseActionFormBaseHook = (
  options: {
    getFormOptions: ActionFormBaseProps['getFormOptions'];
  } & Pick<
    ActionFormProps<any>,
    | 'transform'
    | 'actionType'
    | 'defaultValues'
    | 'validationSchema'
    | 'mode'
    | 'reValidateMode'
    | 'onSuccess'
  >,
) => void;

export interface ActionSidebarProps {
  initialValues?: FieldValues;
  transactionId?: string;
  className?: string;
}
