import { type FieldValues, type UseFormReturn } from 'react-hook-form';

import { type ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';

export interface ActionButtonsProps {
  isActionDisabled?: boolean;
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
    | 'transform'
    | 'actionType'
    | 'defaultValues'
    | 'validationSchema'
    | 'mode'
    | 'reValidateMode'
  >,
) => void;

export interface ActionSidebarProps {
  initialValues?: FieldValues;
  className?: string;
}
