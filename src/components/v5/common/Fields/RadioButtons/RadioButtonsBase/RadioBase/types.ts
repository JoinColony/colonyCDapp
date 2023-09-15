export interface RadioProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'children'> {
  wrapperClassName?: string;
  labelClassName?: string;
  children?:
    | React.ReactNode
    | ((opts: Pick<RadioProps, 'checked' | 'disabled'>) => React.ReactNode);
}
