export type SwitchProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface FormSwitchProps
  extends Omit<SwitchProps, 'onChange' | 'value'> {
  name: string;
}
