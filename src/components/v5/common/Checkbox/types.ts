import { FieldValues, UseFormRegister } from 'react-hook-form';
import { MessageDescriptor } from 'react-intl';

export interface CheckboxProps {
  label?: string | MessageDescriptor;
  register?: UseFormRegister<FieldValues>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  classNames?: string;
  isChecked?: boolean;
  mode?: CheckboxMode;
  value?: string;
}

type CheckboxMode = 'primary' | 'secondary';
