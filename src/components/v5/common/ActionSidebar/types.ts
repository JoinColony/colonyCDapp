import { UseFormProps } from 'react-hook-form';
import * as yup from 'yup';
import { MessageDescriptor } from 'react-intl';
import { Action } from '~constants/actions';
import { ActionTypes } from '~redux';

export type PopularActionsProps = {
  setSelectedAction: React.Dispatch<React.SetStateAction<Action | null>>;
};

export type ActionButtonsProps = {
  isActionDisabled?: boolean;
};

export type ErrorBannerProps = {
  title: MessageDescriptor | string;
  actionText?: MessageDescriptor | string;
};

//
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
