import { FieldValues, UseFormRegister } from 'react-hook-form';

export interface SpecialInputProps {
  id?: string;
  name: string;
  value?: number | string;
  register?: UseFormRegister<FieldValues>;
  type: ComponentType;
  defaultValue?: number;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  isError?: boolean;
  onChange?: () => void;
}

export type ComponentType = 'percent' | 'hours';

export type FormHourInput = {
  hours?: number;
};

export type FormPercentageInput = {
  percentage?: number;
};
