import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
import { ExtensionStatusBadgeProps } from '~common/Extensions/ExtensionStatusBadge-new/types';
import { TooltipProps } from '~shared/Extensions/Tooltip/types';

export interface RadioItemProps {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  badge?: ExtensionStatusBadgeProps;
  tooltip?: TooltipProps;
}

export interface RadioBaseProps {
  isError?: boolean;
  register: UseFormRegister<FormRadioButton>;
  item?: RadioItemProps;
}

export interface RadioListProps extends RadioBaseProps {
  title: string;
  items: RadioItemProps[];
  errors: Partial<
    FieldErrorsImpl<{
      radio: string;
    }>
  >;
}

export interface FormRadioButton {
  radio: string;
  extension: {
    [key: string]: number;
  };
}
