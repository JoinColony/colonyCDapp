import {
  type RadioButtonsBaseProps,
  type RadioItem,
} from '../RadioButtonsBase/types.ts';

export interface ButtonRadioButtonItem<TValue>
  extends Omit<RadioItem<TValue>, 'children' | 'label'> {
  colorClassName: string;
  hoverColorClassName: string;
  checkedColorClassName: string;
  iconClassName?: string;
  label: React.ReactNode;
  iconName?: string;
}

export interface ButtonRadioButtonsProps<TValue>
  extends Omit<RadioButtonsBaseProps<TValue>, 'items'> {
  items: ButtonRadioButtonItem<TValue>[];
}

export interface FormButtonRadioButtonsProps<TValue>
  extends Omit<ButtonRadioButtonsProps<TValue>, 'onChange' | 'value'> {
  name: string;
}
