import { InputHTMLAttributes } from 'react';

export interface RadioBaseProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isError?: boolean;
}

export interface RadioItemProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioListProps extends RadioBaseProps {
  id: string;
  name: string;
  defaultValue?: number;
  title: string;
  items: RadioItemProps[];
}
