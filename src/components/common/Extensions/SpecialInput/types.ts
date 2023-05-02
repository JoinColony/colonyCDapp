import { UseFormRegister } from 'react-hook-form';

export interface SpecialInputProps {
  id: string;
  name: string;
  register: UseFormRegister<FormHourInput | FormPercentageInput>;
  type: ComponentType;
  defaultValue?: number;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  isError?: boolean;
}

export type ComponentType = 'percentage' | 'hour';

export type FormHourInput = {
  hour: number;
};

export type FormPercentageInput = {
  percentage: number;
};
