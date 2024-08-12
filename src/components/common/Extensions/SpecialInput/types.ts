import { type SyntheticEvent } from 'react';
import { type FieldValues, type UseFormRegister } from 'react-hook-form';

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
  step?: number;
  isError?: boolean;
  onChange?: (e: SyntheticEvent<HTMLInputElement>) => void;
}

export type ComponentType = 'percent' | 'hours' | 'days';

export type FormHourInput = {
  hours?: number;
};

export type FormPercentageInput = {
  percentage?: number;
};
