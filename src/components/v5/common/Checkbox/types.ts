import { FieldValues, UseFormRegister } from 'react-hook-form';

import { Message } from '~types/index.ts';

export interface CheckboxProps {
  label?: Message;
  register?: UseFormRegister<FieldValues>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  classNames?: string;
  isChecked?: boolean;
}
