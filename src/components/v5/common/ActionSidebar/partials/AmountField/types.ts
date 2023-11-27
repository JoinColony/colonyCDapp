export type CleaveChangeEvent = React.ChangeEvent<
  HTMLInputElement & { rawValue: string }
>;

export interface AmountFieldProps {
  name: string;
  amount?: string;
  defaultToken?: string;
  tokenAddress?: string;
  maxWidth?: number;
}
