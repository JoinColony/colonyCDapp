import { SelectProps } from '../../types';

export type CleaveChangeEvent = React.ChangeEvent<
  HTMLInputElement & { rawValue: string }
>;

export interface AmountFieldProps extends SelectProps {
  amount?: string;
  defaultToken?: string;
}
