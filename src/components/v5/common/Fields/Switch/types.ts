import { FieldValues, UseFormRegister } from 'react-hook-form';

export type SwitchProps = {
  id?: string;
  isDisabled?: boolean;
  isChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  register?: UseFormRegister<FieldValues>;
};
