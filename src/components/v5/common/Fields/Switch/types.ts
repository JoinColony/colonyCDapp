import { FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';

export type SwitchProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
> = {
  id: TFieldName;
  isDisabled?: boolean;
  isChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  register?: UseFormRegister<TFieldValues>;
};
