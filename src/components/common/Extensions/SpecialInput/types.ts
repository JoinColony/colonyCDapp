import { UseFormRegister } from 'react-hook-form';

export interface SpecialHourInputProps {
  id: string;
  name: string;
  register: UseFormRegister<Inputs>;
  defaultValue?: number;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  isError?: boolean;
}

export type Inputs = {
  hour: number;
};
