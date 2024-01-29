import { type TooltipProps } from '~shared/Extensions/Tooltip/types.ts';
import { type Message } from '~types/index.ts';
import { type PillsProps } from '~v5/common/Pills/types.ts';

export interface RadioItemProps {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  badge?: PillsProps;
  tooltip?: TooltipProps;
}

export interface RadioBaseProps {
  name: string;
  isError?: boolean;
  item?: RadioItemProps;
  onChange?: (e: string) => void;
  checked?: boolean;
}

export interface RadioListProps extends RadioBaseProps {
  title: string;
  items: RadioItemProps[];
  onChange?: (e: string) => void;
  error?: Message;
  checkedRadios?: Record<string, boolean>;
}

export interface FormRadioButton {
  governance: string;
  extension: {
    [key: string]: number;
  };
}
