import { type FieldValues, type UseFormRegister } from 'react-hook-form';

import { type Message } from '~types/index.ts';

export interface CheckboxProps {
  label?: Message;
  register?: UseFormRegister<FieldValues>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  isChecked?: boolean;
}
