import { SelectProps } from '../../types';

export type CleaveChangeEvent = React.ChangeEvent<
  HTMLInputElement & { rawValue: string }
>;

export interface AmountFieldProps extends Pick<SelectProps, 'name'> {
  amount?: string;
  defaultToken?: string;
  isErrors: boolean;
}
