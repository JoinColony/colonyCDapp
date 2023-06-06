import { MessageDescriptor } from 'react-intl';
import { ElementType } from 'react';
import { ButtonProps } from '../Button/types';
import { ActionTransformFnType } from '~utils/actions';

export interface ActionButtonProps extends ButtonProps {
  button?: ElementType;
  confirmText?: MessageDescriptor | string;
  error: string;
  onConfirmToggled?: (...args: []) => void;
  onSuccess?: (result) => void;
  onError?: (error) => void;
  submit: string;
  success: string;
  text?: MessageDescriptor | string;
  transform?: ActionTransformFnType;
  // @TODO fix types
  values?: any | (() => any | Promise<any>);
}
