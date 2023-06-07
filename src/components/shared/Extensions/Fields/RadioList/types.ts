import { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form';
import { ExtensionStatusBadgeProps } from '~common/Extensions/ExtensionStatusBadge/types';
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
  name: string;
  isError?: boolean;
  register: UseFormRegister<FieldValues>;
  item?: RadioItemProps;
  onChange?: (e: string) => void;
}

export interface RadioListProps extends RadioBaseProps {
  title: string;
  items: RadioItemProps[];
  errors: Partial<
    FieldErrorsImpl<{
      governance: string;
    }>
  >;
  onChange?: (e: string) => void;
}

export interface FormRadioButton {
  governance: string;
  extension: {
    [key: string]: number;
  };
}
