import { UseFormProps } from 'react-hook-form';
import * as yup from 'yup';
import { Action } from '~constants/actions';
import { ActionTypes } from '~redux';

export interface ActionButtonsProps {
  isActionDisabled?: boolean;
}

export interface PopularActionsProps {
  setSelectedAction: (action: Action | null) => void;
}

export type ActionFormOptions = UseFormProps & {
  onSubmit: (values: Record<string, any>) => Promise<any>;
};

export interface ActionFormBaseProps {
  getFormOptions: (formOptions: ActionFormOptions | undefined) => void;
}

export type UseActionFormBaseHook = (options: {
  validationSchema: yup.ObjectSchema;
  transform: (...args: any[]) => any;
  defaultValues: ActionFormOptions['defaultValues'];
  actionType: ActionTypes;
  getFormOptions: ActionFormBaseProps['getFormOptions'];
}) => void;
