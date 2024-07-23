export type SwitchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  greyOutWhenDisabled?: boolean;
};

export interface FormSwitchProps
  extends Omit<SwitchProps, 'onChange' | 'value'> {
  name: string;
}
