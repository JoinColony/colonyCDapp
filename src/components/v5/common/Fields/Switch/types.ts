export type SwitchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  testId?: string;
};

export interface FormSwitchProps
  extends Omit<SwitchProps, 'onChange' | 'value'> {
  name: string;
}
