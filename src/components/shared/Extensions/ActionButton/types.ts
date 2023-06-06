import { MessageDescriptor } from 'react-intl';
import { ElementType } from 'react';
import { ButtonProps } from '../Button/types';
import { ActionTransformFnType } from '~utils/actions';

export interface ActionButtonProps extends ButtonProps {
  button?: ElementType;
  confirmText?: any;
  error: string;
  onConfirmToggled?: (...args: any[]) => void;
  onSuccess?: (result: any) => void;
  submit: string;
  success: string;
  text?: MessageDescriptor | string;
  transform?: ActionTransformFnType;
  values?: any | (() => any | Promise<any>);
}
