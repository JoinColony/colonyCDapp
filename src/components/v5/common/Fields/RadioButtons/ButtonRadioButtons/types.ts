import { RadioButtonsBaseProps, RadioItem } from '../RadioButtonsBase/types';

export interface ButtonRadioButtonItem
  extends Omit<RadioItem<string>, 'children' | 'label'> {
  colorClassName: string;
  label: React.ReactNode;
  iconName?: string;
}

export interface ButtonRadioButtonsProps
  extends Omit<RadioButtonsBaseProps<string>, 'items'> {
  items: ButtonRadioButtonItem[];
}

export interface FormButtonRadioButtonsProps
  extends Omit<ButtonRadioButtonsProps, 'onChange' | 'value'> {
  name: string;
}
