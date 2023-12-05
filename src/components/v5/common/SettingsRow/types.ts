import { FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';
import { MessageDescriptor } from 'react-intl';

import { ButtonMode } from '~v5/shared/Button/types';

export interface SettingsRowProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
> {
  title: MessageDescriptor;
  description: MessageDescriptor;
  tooltipMessage?: MessageDescriptor;
  handleOnChange?: (value: boolean) => void;
  onClick?: () => void;
  buttonLabel?: MessageDescriptor;
  buttonIcon?: string;
  buttonMode?: ButtonMode;
  id?: TFieldName;
  register?: UseFormRegister<TFieldValues>;
}
