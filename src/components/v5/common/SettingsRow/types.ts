import { type Icon } from '@phosphor-icons/react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { type MessageDescriptor } from 'react-intl';

import { type ButtonMode } from '~v5/shared/Button/types.ts';

export interface SettingsRowProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
> {
  title: MessageDescriptor;
  description: MessageDescriptor;
  tooltipMessage?: MessageDescriptor;
  onClick?: () => void;
  buttonLabel?: MessageDescriptor;
  buttonIcon?: Icon;
  buttonMode?: ButtonMode;
  name: TFieldName;
  className?: string;
  titleClassName?: string;
  additionalContent?: string;
}
